# ReFrame

Marketing site for **ReFrame**, the app that teaches people to read the language of film,
plus **Nolan**, its AI film tutor. Built with **TanStack Start** (React + TanStack Router + Vite).

## Run it

```bash
npm install          # first time only
cp .env.example .env # first time only, then paste your Anthropic API key into .env (never commit .env)
npm run dev          # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server with hot reload at http://localhost:3000 |
| `npm run build` | Production build (Nitro writes a Node server to `.output/`; on Vercel it builds for Vercel automatically) |
| `npm start` | Runs the production build at http://localhost:3000 (run `npm run build` first) |
| `npm run typecheck` | TypeScript check |

The site works without an API key; only Nolan's live answers need one.

## Deploy (Vercel)

Import the GitHub repo in Vercel; no settings are needed (Nitro detects Vercel during the build).
For Nolan's live answers, add `ANTHROPIC_API_KEY` under **Project → Settings → Environment Variables**, then redeploy.

## How it's organised

| Path | What's there |
| --- | --- |
| `src/routes/__root.tsx` | The HTML document: `<head>` (title, fonts, CSS) and `<body>` |
| `src/routes/index.tsx` | The home page (`/`): puts the section components together and starts the browser scripts |
| `src/routes/api/nolan.ts` | **Server route** `POST /api/nolan`: Nolan's chat endpoint |
| `src/server/nolan.server.ts` | Server-only Nolan logic (Claude API call, limits, streaming). The API key never reaches the browser |
| `src/components/` | One React component per section: `SiteHeader`, `IntroTitleCard`, `Hero`, `Features`, `MeetNolan`, `HowItWorks`, `Mission`, `Showcase`, `CallToAction`, `SiteFooter`, plus `Overlays` (cursor, film grain, timecode) |
| `src/lib/site.js` | Browser behaviour: countdown, scroll animations, showcase scroller, Nolan chat, popcorn finale |
| `src/lib/three-scene.js` | The 3D film camera and stage lights (Three.js) behind the hero |
| `src/styles.css` | All styling; colours and fonts are CSS variables at the top |
| `public/images/` | Film stills |
| `public/models/` | 3D models exported from Blender (`blender/build_models.py`) |
| `legacy-static/` | The earlier plain HTML/CSS/JS version of the site, kept for reference |

## Credits

Film stills are used for educational purposes, to illustrate how ReFrame analyses a shot. All rights belong to their respective studios and filmmakers:

- *Oppenheimer* (2023), Christopher Nolan
- *Babylon* (2022), Damien Chazelle
- *Do the Right Thing* (1989), Spike Lee
- *In the Mood for Love* (2000), Wong Kar-wai
- *Get Out* (2017), Jordan Peele
- *The Social Network* (2010), David Fincher
- *Phantom Thread* (2017), Paul Thomas Anderson

Nolan, the AI film tutor, is named in homage to Christopher Nolan and is not affiliated with him.
