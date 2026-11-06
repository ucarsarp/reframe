/* ==========================================================================
   ReFrame — src/server/nolan-app.server.ts
   Nolan for the ReFrame app (POST /api/app/nolan). Unlike the website demo, the app
   needs an account: each question spends one Nolan credit from Supabase, and the
   conversation is saved so it shows up under "Sessions with Nolan".
   Needs SUPABASE_SECRET_KEY in the Vercel environment variables.
   ========================================================================== */
import '@tanstack/react-start/server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { MAX_BODY, connect, startReply, toClaudeMessages } from './nolan.server'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hyrgcuvnuciwefrzhcjj.supabase.co'

const SLUG = /^[a-z0-9-]{1,80}$/
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

// The app's web preview runs on another origin. Sign-in travels in the Authorization header, not cookies.
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Authorization, Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Expose-Headers': 'X-Credits-Left',
}

const text = (body: string, status: number) => new Response(body, { status, headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8' } })

export const appNolanPreflight = () => new Response(null, { status: 204, headers: CORS })

/* ---------- Supabase, as the server (the secret key bypasses row security) ---------- */
function db(secret: string, route: string, init: RequestInit = {}) {
  return fetch(`${SUPABASE_URL}/rest/v1/${route}`, {
    ...init,
    headers: { apikey: secret, 'Content-Type': 'application/json', ...init.headers },
  })
}

// Who is asking: the app sends the user's Supabase sign-in token
async function userFrom(request: Request, secret: string): Promise<string | null> {
  const token = request.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1]
  if (!token) return null
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, { headers: { apikey: secret, Authorization: `Bearer ${token}` } })
  if (!res.ok) return null
  const user = (await res.json()) as { id?: string }
  return user.id ?? null
}

type Spend = { ok: boolean; pool: string | null; free_credits: number; paid_credits: number }

async function spendCredit(secret: string, user: string, ref: string): Promise<Spend | null> {
  const res = await db(secret, 'rpc/spend_credit', { method: 'POST', body: JSON.stringify({ p_user: user, p_ref: ref }) })
  if (!res.ok) return null
  const rows = (await res.json()) as Spend[]
  return rows[0] ?? null
}

async function refundCredit(secret: string, user: string, pool: string, ref: string) {
  const res = await db(secret, 'rpc/refund_credit', { method: 'POST', body: JSON.stringify({ p_user: user, p_pool: pool, p_ref: ref }) })
  if (!res.ok) console.error('Nolan refund failed:', res.status, await res.text())
}

async function ownsSession(secret: string, user: string, session: string) {
  const res = await db(secret, `nolan_sessions?select=id&id=eq.${session}&user_id=eq.${user}`)
  return res.ok && ((await res.json()) as unknown[]).length === 1
}

/* ---------- What Nolan knows about a film or scene from the library ----------
   The app shows ReFrame's own diagrams rather than copyrighted frames, so Nolan gets the scene
   as text. Public-domain films (still_url set) also send him the still. */
type Light = { label: string }
type SceneRow = { title: string; moment: string; shot: string; angle: string; lens: string; light: string; movement: string; intent: string; setup: { camera: { label: string }; lights: Light[]; subjects: Light[] } }
type FilmRow = { title: string; year: number; director: string; logline: string; still_url: string | null; scenes?: { title: string }[] }

async function libraryContext(secret: string, film: string | null, scene: string | null): Promise<{ text: string; still: string | null } | null> {
  if (scene) {
    const res = await db(secret, `scenes?select=*,films(*)&id=eq.${scene}`)
    const row = res.ok ? ((await res.json()) as (SceneRow & { films: FilmRow })[])[0] : undefined
    if (!row) return null
    const f = row.films
    const setup = row.setup
    return {
      still: f.still_url,
      text: [
        `The student is studying a scene from ${f.title} (${f.year}, ${f.director}) in the ReFrame library. Unless a still is attached, ReFrame shows them a diagram of the likely setup rather than the frame itself, so explain from what you know of the film.`,
        `Scene: ${row.title}. ${row.moment}`,
        `ReFrame's breakdown: ${row.shot}; ${row.angle}; ${row.lens}; ${row.light}; ${row.movement}.`,
        `The diagram shows: camera ${setup.camera.label}; ${setup.subjects.map((x) => x.label).join(', ')}; lights: ${setup.lights.map((l) => l.label).join(', ') || 'none'}.`,
        `ReFrame's reading of the intent: ${row.intent}`,
      ].join('\n'),
    }
  }
  if (film) {
    const res = await db(secret, `films?select=*,scenes(title)&id=eq.${film}`)
    const f = res.ok ? ((await res.json()) as FilmRow[])[0] : undefined
    if (!f) return null
    return {
      still: f.still_url,
      text: `The student is asking about ${f.title} (${f.year}, ${f.director}): ${f.logline} Scenes they can explore in the ReFrame library: ${(f.scenes ?? []).map((x) => x.title).join(', ') || 'none yet'}.`,
    }
  }
  return null
}

async function stillAsImage(url: string): Promise<Anthropic.Beta.BetaContentBlockParam | null> {
  try {
    const res = await fetch(url)
    const type = res.headers.get('content-type')?.split(';')[0]
    if (!res.ok || (type !== 'image/jpeg' && type !== 'image/png' && type !== 'image/webp')) return null
    return { type: 'image', source: { type: 'base64', media_type: type, data: Buffer.from(await res.arrayBuffer()).toString('base64') } }
  } catch {
    return null
  }
}

async function saveTurn(secret: string, user: string, session: string, question: string, answer: string) {
  const rows = [
    { session_id: session, user_id: user, role: 'user', text: question },
    { session_id: session, user_id: user, role: 'assistant', text: answer },
  ]
  const saved = await db(secret, 'nolan_messages', { method: 'POST', headers: { Prefer: 'return=minimal' }, body: JSON.stringify(rows) })
  if (!saved.ok) throw new Error(`saving messages: ${saved.status} ${await saved.text()}`)
  await db(secret, `nolan_sessions?id=eq.${session}`, { method: 'PATCH', headers: { Prefer: 'return=minimal' }, body: JSON.stringify({ updated_at: new Date().toISOString() }) })
}

/* ---------- POST /api/app/nolan ----------
   Body: { sessionId, film?, scene?, messages: [{ role, text, image? }] }
   402 when the user has no credits left, 401 when they need to sign in again.
   Streams the reply as plain text; X-Credits-Left says what's left after this question. */
export async function handleAppNolan(request: Request): Promise<Response> {
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!secret) return text('Nolan isn’t switched on for the app yet.', 503)
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return text('That image is too large.', 413)

  const user = await userFrom(request, secret)
  if (!user) return text('Sign in to ask Nolan.', 401)

  let body: { sessionId?: unknown; film?: unknown; scene?: unknown; messages?: unknown } | null = null
  try { body = await request.json() } catch { /* handled below */ }
  const messages = toClaudeMessages(body?.messages)
  const session = typeof body?.sessionId === 'string' && UUID.test(body.sessionId) ? body.sessionId : null
  const film = typeof body?.film === 'string' && SLUG.test(body.film) ? body.film : null
  const scene = typeof body?.scene === 'string' && SLUG.test(body.scene) ? body.scene : null
  if (!messages || !session) return text('Bad request.', 400)
  if (!(await ownsSession(secret, user, session))) return text('Bad request.', 400)

  const ai = connect(request)
  if (!ai) return text('Nolan is resting right now. Try again later. Your credit was not used.', 503)

  // A film or scene from the library: tell Nolan about it with the first question
  const context = await libraryContext(secret, film, scene)
  if (context) {
    const first = messages[0].content as Anthropic.Beta.BetaContentBlockParam[]
    const image = context.still ? await stillAsImage(context.still) : null
    first.unshift(...(image ? [image] : []), { type: 'text', text: context.text })
  }

  const spend = await spendCredit(secret, user, session)
  if (!spend) return text('Something went wrong. Your credit was not used.', 502)
  if (!spend.ok || !spend.pool) return text('You’re out of credits.', 402)
  const pool = spend.pool

  const question = (body!.messages as { text: string }[]).at(-1)!.text.trim()
  const reply = await startReply(ai, messages, request.signal, async (answer, complete) => {
    // Only a full answer costs a credit; anything cut short is refunded and not saved
    if (complete && answer.trim()) await saveTurn(secret, user, session, question, answer)
    else await refundCredit(secret, user, pool, session)
  })
  if (!reply.ok) {
    console.error('Nolan app error:', reply.status ?? '', reply.error instanceof Error ? reply.error.message : reply.error)
    await refundCredit(secret, user, pool, session)
    return text(reply.status === 429 ? 'Nolan is busy right now. Try again in a minute. Your credit was not used.' : 'Nolan lost his train of thought. Try again. Your credit was not used.', reply.status === 429 ? 429 : 502)
  }

  return new Response(reply.body, {
    headers: { ...CORS, 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache', 'X-Credits-Left': String(spend.free_credits + spend.paid_credits) },
  })
}
