import { defineConfig, loadEnv } from 'vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Make .env values (like ANTHROPIC_API_KEY) available to server code during `npm run dev`.
  // They never reach the browser: only VITE_-prefixed variables are exposed to client code.
  const env = loadEnv(mode, process.cwd(), '')
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }

  return {
    server: { port: 3000 },
    plugins: [
      tanstackStart(), // must come before react()
      viteReact(),
    ],
  }
})
