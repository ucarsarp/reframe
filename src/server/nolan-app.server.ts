/* ==========================================================================
   ReFrame — src/server/nolan-app.server.ts
   Nolan for the ReFrame app (POST /api/app/nolan). Unlike the website demo, the app
   needs an account: each question spends one Nolan credit from Supabase, and the
   conversation is saved so it shows up under "Sessions with Nolan".
   Needs SUPABASE_SECRET_KEY in the Vercel environment variables.
   ========================================================================== */
import '@tanstack/react-start/server-only'
import type Anthropic from '@anthropic-ai/sdk'
import { MAX_BODY, connect, loadStill, startReply, toClaudeMessages } from './nolan.server'

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://hyrgcuvnuciwefrzhcjj.supabase.co'

// The films in the app's library, so Nolan knows which still he is looking at
const FILMS: Record<string, string> = {
  'in-the-mood-for-love': 'In the Mood for Love (2000, Wong Kar-wai)',
  'get-out': 'Get Out (2017, Jordan Peele)',
  'social-network': 'The Social Network (2010, David Fincher)',
  'phantom-thread': 'Phantom Thread (2017, Paul Thomas Anderson)',
  oppenheimer: 'Oppenheimer (2023, Christopher Nolan)',
  babylon: 'Babylon (2022, Damien Chazelle)',
  'do-the-right-thing': 'Do the Right Thing (1989, Spike Lee)',
}

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
   Body: { sessionId, film?, messages: [{ role, text, image? }] }
   402 when the user has no credits left, 401 when they need to sign in again.
   Streams the reply as plain text; X-Credits-Left says what's left after this question. */
export async function handleAppNolan(request: Request): Promise<Response> {
  const secret = process.env.SUPABASE_SECRET_KEY
  if (!secret) return text('Nolan isn’t switched on for the app yet.', 503)
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return text('That image is too large.', 413)

  const user = await userFrom(request, secret)
  if (!user) return text('Sign in to ask Nolan.', 401)

  let body: { sessionId?: unknown; film?: unknown; messages?: unknown } | null = null
  try { body = await request.json() } catch { /* handled below */ }
  const messages = toClaudeMessages(body?.messages)
  const session = typeof body?.sessionId === 'string' && UUID.test(body.sessionId) ? body.sessionId : null
  const film = typeof body?.film === 'string' && body.film in FILMS ? body.film : null
  if (!messages || !session) return text('Bad request.', 400)
  if (!(await ownsSession(secret, user, session))) return text('Bad request.', 400)

  const ai = connect(request)
  if (!ai) return text('Nolan is resting right now. Try again later. Your credit was not used.', 503)

  // A film from the library: show Nolan the still with the first question
  if (film) {
    const still = await loadStill(new URL(request.url).origin, film)
    const first = messages[0].content as Anthropic.Beta.BetaContentBlockParam[]
    first.unshift(
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: still } },
      { type: 'text', text: `This is a still from ${FILMS[film]}.` },
    )
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
