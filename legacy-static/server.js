/* ==========================================================================
   ReFrame — server.js
   Serves the site and runs Nolan, the AI film tutor, through the Claude API.
   The API key stays here on the server and never reaches the browser.

   Start:  npm install, copy .env.example to .env, add your key, npm start
   Then open http://localhost:3000
   ========================================================================== */
import express from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { readFileSync } from 'node:fs';

const PORT = process.env.PORT || 3000;
const MODEL = 'claude-opus-5-5';

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from .env

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
const getOutStill = readFileSync('images/get-out.jpg').toString('base64');
const DEMO = [
  {
    role: 'user',
    content: [
      { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: getOutStill } },
      { type: 'text', text: 'This is the hypnosis scene from Get Out (2017, Jordan Peele). Why does it feel so claustrophobic?' },
    ],
  },
  {
    role: 'assistant',
    content: "The frame is almost all face: no headroom, no space to the sides, and the background falls into darkness. There's nowhere for your eye to escape, just like Chris.",
  },
];

/* ---------- Limits (protect your API bill once the site is public) ---------- */
const MAX_TURNS = 20;              // messages of history kept per request
const MAX_TEXT = 1000;             // characters per question
const MAX_IMAGE = 5 * 1024 * 1024; // base64 characters per uploaded still
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const RATE_LIMIT = 20;             // questions per visitor...
const RATE_WINDOW = 10 * 60 * 1000; // ...per 10 minutes
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > RATE_LIMIT;
}

// Turn the browser's simple history into Claude messages, rejecting anything odd
function toClaudeMessages(history) {
  if (!Array.isArray(history) || history.length === 0) return null;
  const turns = history.slice(-MAX_TURNS);
  if (turns[0].role !== 'user') turns.shift();
  const messages = [];
  for (const [i, turn] of turns.entries()) {
    const role = i % 2 === 0 ? 'user' : 'assistant';
    if (!turn || turn.role !== role || typeof turn.text !== 'string') return null;
    const text = turn.text.trim().slice(0, role === 'user' ? MAX_TEXT : 8000);
    if (!text) return null;
    const content = [];
    if (role === 'user' && turn.image) {
      const { media_type, data } = turn.image;
      if (!IMAGE_TYPES.includes(media_type) || typeof data !== 'string' || data.length > MAX_IMAGE) return null;
      content.push({ type: 'image', source: { type: 'base64', media_type, data } });
    }
    content.push({ type: 'text', text });
    messages.push({ role, content });
  }
  return messages.at(-1)?.role === 'user' ? messages : null;
}

const app = express();
app.use(express.json({ limit: '8mb' }));
app.use(express.static('.', { index: 'index.html' }));

/* ---------- POST /api/nolan ----------
   Body: { messages: [{ role: 'user' | 'assistant', text, image?: { media_type, data } }] }
   Streams Nolan's reply back as plain text, piece by piece. */
app.post('/api/nolan', async (req, res) => {
  if (rateLimited(req.ip)) return res.status(429).send('Too many questions, try again in a few minutes.');

  const messages = toClaudeMessages(req.body?.messages);
  if (!messages) return res.status(400).send('Bad request.');

  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');

  const stream = client.beta.messages.stream({
    model: MODEL,
    max_tokens: 4096,
    output_config: { effort: 'low' }, // quick, chatty answers
    // If a safety check declines a request, the API retries it on another model
    betas: ['server-side-fallback-2026-07-01'],
    fallbacks: 'default',
    system: NOLAN,
    messages: [...DEMO, ...messages],
  });

  // Stop paying for tokens if the visitor closes the page mid-answer
  let left = false;
  res.on('close', () => { if (!res.writableFinished) { left = true; stream.abort(); } });

  try {
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        res.write(event.delta.text);
      }
    }
    const final = await stream.finalMessage();
    if (final.stop_reason === 'refusal') res.write("\n\nI can't help with that one. Ask me about a shot, a scene or a film instead.");
    res.end();
  } catch (err) {
    if (left) return;
    console.error('Nolan error:', err.status ?? '', err.message);
    if (!res.headersSent) res.status(err.status === 429 ? 429 : 502);
    res.end("\n\nSorry, I lost my train of thought. Try asking again.");
  }
});

app.listen(PORT, () => console.log(`ReFrame running at http://localhost:${PORT}`));
