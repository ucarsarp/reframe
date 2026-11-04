/* ==========================================================================
   ReFrame — src/server/nolan.server.ts
   Nolan, the AI film tutor, through the Claude API (ported from server.js).
   Server-only: the API key stays here and never reaches the browser.
   The HTTP endpoint is src/routes/api/nolan.ts (POST /api/nolan).
   ========================================================================== */
import '@tanstack/react-start/server-only'
import Anthropic from '@anthropic-ai/sdk'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

const MODEL = 'claude-opus-5-5'

/* ---------- Who Nolan is ----------
   Edit this to change his personality, tone or what he focuses on. */
const NOLAN = `You are Nolan, the AI film tutor inside ReFrame, an app that teaches people to read the language of film. You are named after Christopher Nolan.

How you help:
- When shown a film still, break it down: shot type, camera angle, lens, lighting, movement and the director's likely intent. If you recognise the film, say so; if you are not sure, say that instead of guessing.
- Explain like a warm, sharp film-school tutor talking to a beginner: plain words, no unexplained jargon.
- When it helps, end with one practical tip for recreating the shot with everyday gear (a phone, a lamp, a window).

Style: keep answers short, two or three small paragraphs at most. Write plain text with no markdown, headings or bullet symbols, because your reply appears in a small chat bubble.

Stay on film, photography, video-making and visual storytelling. If asked about something unrelated, steer back to film in a friendly way.`;

/* ---------- The example conversation already on the page ----------
   Every chat starts as a follow-up to it, so Nolan can see the Get Out still. */
let demoMessages: Anthropic.Beta.BetaMessageParam[] | null = null

// The still is fetched from the site itself, because on hosts like Vercel the server
// functions can't read the public/ folder from disk. Locally, reading the file also works.
async function loadStill(origin: string): Promise<string> {
  try {
    const res = await fetch(new URL('/images/get-out.jpg', origin))
    if (res.ok) return Buffer.from(await res.arrayBuffer()).toString('base64')
  } catch { /* fall back to the file on disk */ }
  return (await readFile(path.join(process.cwd(), 'public', 'images', 'get-out.jpg'))).toString('base64')
}

async function demo(origin: string): Promise<Anthropic.Beta.BetaMessageParam[]> {
  if (!demoMessages) {
    const still = await loadStill(origin)
    demoMessages = [
      {
        role: 'user',
        content: [
          { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: still } },
          { type: 'text', text: 'This is the hypnosis scene from Get Out (2017, Jordan Peele). Why does it feel so claustrophobic?' },
        ],
      },
      {
        role: 'assistant',
        content: "The frame is almost all face: no headroom, no space to the sides, and the background falls into darkness. There's nowhere for your eye to escape, just like Chris.",
      },
    ]
  }
  return demoMessages
}

/* ---------- Limits (protect your API bill once the site is public) ---------- */
const MAX_TURNS = 20;              // messages of history kept per request
const MAX_TEXT = 1000;             // characters per question
const MAX_IMAGE = 5 * 1024 * 1024; // base64 characters per uploaded still
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const RATE_LIMIT = 20;             // questions per visitor...
const RATE_WINDOW = 10 * 60 * 1000; // ...per 10 minutes
const MAX_BODY = 8 * 1024 * 1024;  // bytes per request (same as the old express.json limit)
const hits = new Map<string, number[]>()

function rateLimited(ip: string) {
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW)
  recent.push(now)
  hits.set(ip, recent)
  return recent.length > RATE_LIMIT
}

type Turn = { role?: unknown; text?: unknown; image?: { media_type?: unknown; data?: unknown } }
type ImageType = 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif'

// Turn the browser's simple history into Claude messages, rejecting anything odd
function toClaudeMessages(history: unknown): Anthropic.Beta.BetaMessageParam[] | null {
  if (!Array.isArray(history) || history.length === 0) return null
  const turns = history.slice(-MAX_TURNS) as Turn[]
  if (turns[0]?.role !== 'user') turns.shift()
  const messages: Anthropic.Beta.BetaMessageParam[] = []
  for (const [i, turn] of turns.entries()) {
    const role = i % 2 === 0 ? 'user' : 'assistant'
    if (!turn || turn.role !== role || typeof turn.text !== 'string') return null
    const text = turn.text.trim().slice(0, role === 'user' ? MAX_TEXT : 8000)
    if (!text) return null
    const content: Anthropic.Beta.BetaContentBlockParam[] = []
    if (role === 'user' && turn.image) {
      const { media_type, data } = turn.image
      if (typeof media_type !== 'string' || !IMAGE_TYPES.includes(media_type) || typeof data !== 'string' || data.length > MAX_IMAGE) return null
      content.push({ type: 'image', source: { type: 'base64', media_type: media_type as ImageType, data } })
    }
    content.push({ type: 'text', text })
    messages.push({ role, content })
  }
  return messages.at(-1)?.role === 'user' ? messages : null
}

const SORRY = "\n\nSorry, I lost my train of thought. Try asking again."

function errorResponse(err: unknown) {
  const status = err instanceof Anthropic.APIError ? err.status : undefined
  console.error('Nolan error:', status ?? '', err instanceof Error ? err.message : err)
  return new Response(SORRY, { status: status === 429 ? 429 : 502, headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}

/* ---------- POST /api/nolan ----------
   Body: { messages: [{ role: 'user' | 'assistant', text, image?: { media_type, data } }] }
   Streams Nolan's reply back as plain text, piece by piece. */
export async function handleNolan(request: Request): Promise<Response> {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || 'local'
  if (rateLimited(ip)) return new Response('Too many questions, try again in a few minutes.', { status: 429 })
  if (Number(request.headers.get('content-length') || 0) > MAX_BODY) return new Response('That image is too large.', { status: 413 })

  let body: { messages?: unknown } | null = null
  try { body = await request.json() } catch { /* handled below */ }
  const messages = toClaudeMessages(body?.messages)
  if (!messages) return new Response('Bad request.', { status: 400 })

  const client = new Anthropic() // reads ANTHROPIC_API_KEY from .env
  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 4096,
    output_config: { effort: 'low' }, // quick, chatty answers
    // If a safety check declines a request, the API retries it on another model
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: NOLAN,
    messages: [...(await demo(new URL(request.url).origin)), ...messages],
  })

  // Stop paying for tokens if the visitor closes the page mid-answer
  request.signal.addEventListener('abort', () => stream.abort())

  // Wait for the first event so API errors (bad key, rate limit) still get a proper status code
  const events = stream[Symbol.asyncIterator]()
  let first: IteratorResult<Anthropic.Beta.BetaRawMessageStreamEvent>
  try { first = await events.next() } catch (err) { return errorResponse(err) }

  const encoder = new TextEncoder()
  const reply = new ReadableStream<Uint8Array>({
    async start(controller) {
      const write = (text: string) => controller.enqueue(encoder.encode(text))
      try {
        for (let step = first; !step.done; step = await events.next()) {
          const event = step.value
          if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') write(event.delta.text)
        }
        const final = await stream.finalMessage()
        if (final.stop_reason === 'refusal') write("\n\nI can't help with that one. Ask me about a shot, a scene or a film instead.")
      } catch (err) {
        if (!request.signal.aborted) {
          console.error('Nolan error:', err instanceof Error ? err.message : err)
          write(SORRY)
        }
      } finally {
        controller.close()
      }
    },
    cancel() { stream.abort() },
  })

  return new Response(reply, { headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-cache' } })
}
