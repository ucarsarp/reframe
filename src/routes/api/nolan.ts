/* POST /api/nolan: Nolan, the AI film tutor (TanStack Start server route).
   The logic lives in src/server/nolan.server.ts, which only ever runs on the server. */
import { createFileRoute } from '@tanstack/react-router'
import { handleNolan } from '../../server/nolan.server'

export const Route = createFileRoute('/api/nolan')({
  server: {
    handlers: {
      POST: ({ request }) => handleNolan(request),
    },
  },
})
