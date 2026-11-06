/* POST /api/app/nolan: Nolan for the ReFrame app, paid with Nolan credits (TanStack Start server route).
   The logic lives in src/server/nolan-app.server.ts, which only ever runs on the server. */
import { createFileRoute } from '@tanstack/react-router'
import { appNolanPreflight, handleAppNolan } from '../../../server/nolan-app.server'

export const Route = createFileRoute('/api/app/nolan')({
  server: {
    handlers: {
      POST: ({ request }) => handleAppNolan(request),
      OPTIONS: () => appNolanPreflight(),
    },
  },
})
