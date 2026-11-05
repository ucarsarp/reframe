/* The HTML document around every page: <head> (title, fonts, CSS) and <body>. */
import type { ReactNode } from 'react'
import { Outlet, createRootRoute, HeadContent, Scripts } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'ReFrame — Learn to read the language of film' },
      {
        name: 'description',
        content: "ReFrame breaks any film frame down into shot type, camera angle, lighting and the director's intent, then teaches you to recreate it with everyday gear.",
      },
    ],
    links: [
      // Fonts: Instrument Serif (display, with italics) + Inter (body) + IBM Plex Mono (labels).
      // Change here and in the CSS variables at the top of src/styles.css.
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap',
      },
      { rel: 'stylesheet', href: appCss },
    ],
    // Flags that JS is available so scroll animations can hide content before it reveals.
    scripts: [{ children: "document.documentElement.classList.add('js')" }],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    // suppressHydrationWarning: the inline script and the site scripts add classes to <html>/<body>
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="in-intro" suppressHydrationWarning>
        {children}
        <Scripts />
        <Analytics />
      </body>
    </html>
  )
}
