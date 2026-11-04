/* ==========================================================================
   ReFrame — src/server/nolan-offline.server.ts
   Nolan without an API key: scripted answers picked by keyword, so the chat
   works on any host for free. Used whenever ANTHROPIC_API_KEY isn't set.
   Edit or add topics below to change what he says.
   ========================================================================== */
import '@tanstack/react-start/server-only'

type Topic = { words: string[]; answers: string[] }

/* ---------- What Nolan knows ----------
   The first topic whose words appear in the question wins; each has a few
   answers so repeated questions don't get the same reply. */
const TOPICS: Topic[] = [
  {
    words: ['similar', 'another shot', 'example', 'reference', 'like this'],
    answers: [
      "For that same trapped feeling, look at the interrogation scenes in Prisoners (2013, Denis Villeneuve) or the close-ups of Maria Falconetti in The Passion of Joan of Arc (1928). Both fill the frame with a face and leave the background with nothing to offer.\n\nIn ReFrame you'd find them by searching for \"extreme close-up\" plus \"low key light\".",
      "Try the opening of Memento (2000) or almost any close-up in Uncut Gems (2019). The Safdies push the camera so close that you feel the character's panic in your own chest.\n\nCompare them side by side and notice how little headroom each one leaves.",
    ],
  },
  {
    words: ['light', 'lighting', 'lit', 'lamp', 'shadow', 'dark'],
    answers: [
      "That look is low-key lighting: one strong source from the side, almost no fill, so half the face drops into shadow. The darkness hides the world and keeps your eye on the eyes.\n\nTo recreate it, sit your subject next to a window at night with one desk lamp beside them and switch every other light off. Move the lamp until only one cheek is lit.",
      "Start with a single key light, the brightest source in the scene, placed 45 degrees to the side. Then decide how much shadow you want; a white sheet or card on the other side softens it, nothing at all keeps it dramatic.\n\nWith a phone, lock the exposure on the bright side of the face so the shadows stay deep.",
    ],
  },
  {
    words: ['lens', 'focal', 'mm', 'zoom', 'wide', 'telephoto', 'depth of field', 'bokeh', 'blur'],
    answers: [
      "That looks like a longer lens, around 85mm, used close. Long lenses flatten the face and blur the background into soft darkness, which is why nothing behind the character competes for attention.\n\nOn a phone, use the 2x or 3x camera and step back instead of moving in. Portrait mode can fake the shallow focus.",
      "Wide lenses (24mm and below) stretch space and make rooms feel big or uneasy; long lenses (85mm and up) compress space and isolate a face. The choice changes how close the world feels, not just how much you can see.\n\nTry shooting the same face at 1x and at 3x from further back and compare the backgrounds.",
    ],
  },
  {
    words: ['angle', 'low angle', 'high angle', 'dutch', 'tilt', 'overhead', "bird's eye", 'eye level'],
    answers: [
      "Camera height is a power dial. Shoot from below and a character towers over us; shoot from above and they shrink. Eye level feels neutral and honest, while a tilted Dutch angle tells you something is off.\n\nWatch how Nolan frames Oppenheimer slightly from below as his power grows, then from above as it collapses.",
    ],
  },
  {
    words: ['close-up', 'close up', 'wide shot', 'medium', 'framing', 'frame', 'composition', 'headroom', 'rule of thirds', 'shot type'],
    answers: [
      "Shot size is distance, and distance is emotion. A wide shot shows where we are, a medium shot shows what someone is doing, and a close-up shows what they're feeling. Directors cut closer as a scene gets more intense.\n\nAs an exercise, film one short moment three times, wide, medium and close, and see which version makes you care most.",
      "Watch the empty space. Leaving room in front of a character's eyes, called lead room, feels natural; taking it away, or cutting off headroom, makes the frame feel tight and tense.\n\nGet Out's hypnosis shot removes all of that space, so Chris has nowhere to go.",
    ],
  },
  {
    words: ['colour', 'color', 'palette', 'grade', 'grading', 'tone'],
    answers: [
      "Colour sets mood before anyone speaks. Warm ambers feel safe or nostalgic, cool blues feel lonely or clinical, and one saturated colour in a muted frame tells you exactly where to look. In the Mood for Love uses deep reds to keep longing on screen even when nothing is said.\n\nTry grading the same clip warm and then cold and notice how the story changes.",
    ],
  },
  {
    words: ['move', 'movement', 'dolly', 'pan', 'tracking', 'handheld', 'steadicam', 'push in', 'crane'],
    answers: [
      "A slow push-in pulls us into a character's head, handheld makes a scene feel urgent and real, and a locked-off camera makes us watch like a witness. The best camera moves are motivated: they follow a feeling or a character, not just a whim.\n\nWith a phone, walk forward very slowly holding it at chest height with both elbows tucked in. That's a homemade dolly.",
    ],
  },
  {
    words: ['nolan', 'christopher', 'inception', 'interstellar', 'dunkirk', 'tenet', 'oppenheimer', 'memento'],
    answers: [
      "Christopher Nolan shoots on film, often IMAX, and prefers practical effects to CGI, so his images feel heavy and real. He loves crosscutting between timelines and building tension by cutting faster as stories converge.\n\nI'm named after him, but I promise I won't tell the story backwards.",
    ],
  },
  {
    words: ['hello', 'hi ', 'hey', 'who are you', 'what can you do', 'help'],
    answers: [
      "Hi, I'm Nolan, ReFrame's film tutor. Ask me about a shot's framing, lighting, lens, angle or colour, or attach a still and I'll talk you through how it was made and how you could recreate it.",
    ],
  },
]

const IMAGE_ANSWERS = [
  "Nice still. Start with where your eye lands first; that's what the director wants you to feel. Then check the light: where's the brightest source, and how much of the frame is left in shadow? Finally, notice the shot size, because the closer the camera, the more personal the moment.\n\nIn the full ReFrame app I'd tag the shot type, angle and lighting for you and link the lessons that match.",
  "Let's read this frame together. Look at what's sharp and what's soft; focus is the director pointing. Then look at the empty space around the subject: lots of it can feel lonely, very little feels tense.\n\nOnce ReFrame launches, I'll break down stills like this one automatically, down to a recreation guide.",
]

const FALLBACK = [
  "Good question. A quick way into any shot is to ask four things: how big is the subject in the frame, where is the camera, where is the light coming from, and what's in focus. Each one is a choice the director made on purpose.\n\nAsk me about any one of those, lighting, lenses, angles or framing, and I'll go deeper.",
  "I'm best on the language of film: framing, lighting, lenses, camera angles, movement and colour. Pick one and I'll explain it with an example and a way to try it yourself.",
]

const pick = (list: string[], seed: number) => list[seed % list.length]

export function offlineAnswer(question: string, hasImage: boolean, turn: number): string {
  const q = ` ${question.toLowerCase()} `
  const topic = TOPICS.find((t) => t.words.some((w) => q.includes(w)))
  if (topic) return pick(topic.answers, turn)
  if (hasImage) return pick(IMAGE_ANSWERS, turn)
  return pick(FALLBACK, turn)
}

// Send the answer a few words at a time so it "types" like the live version
export function streamText(text: string, signal: AbortSignal): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()
  const pieces = text.match(/\S+\s*/g) ?? [text]
  return new ReadableStream<Uint8Array>({
    async start(controller) {
      await new Promise((r) => setTimeout(r, 600)) // a beat of "thinking" dots
      for (const piece of pieces) {
        if (signal.aborted) break
        controller.enqueue(encoder.encode(piece))
        await new Promise((r) => setTimeout(r, 35))
      }
      controller.close()
    },
  })
}
