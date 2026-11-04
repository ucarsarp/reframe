/* The ReFrame marketing page ( / ). Each section is a component in src/components;
   the animations, countdown, Nolan chat and popcorn live in src/lib/site.js,
   and the 3D camera + stage lights in src/lib/three-scene.js. */
import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { Overlays } from '../components/Overlays'
import { SiteHeader } from '../components/SiteHeader'
import { IntroTitleCard } from '../components/IntroTitleCard'
import { Hero } from '../components/Hero'
import { Features } from '../components/Features'
import { MeetNolan } from '../components/MeetNolan'
import { HowItWorks } from '../components/HowItWorks'
import { Mission } from '../components/Mission'
import { Showcase } from '../components/Showcase'
import { CallToAction } from '../components/CallToAction'
import { SiteFooter } from '../components/SiteFooter'
import { initSite } from '../lib/site.js'
import { initThreeScene } from '../lib/three-scene.js'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  useEffect(() => {
    // Start the browser-only scripts once, after React has put the page on screen
    if (window.__reframeStarted) return
    window.__reframeStarted = true
    initSite()
    // Blender models (public/models/reframe-models.js) load first; without them the hand-built models are used
    loadScript('/models/reframe-models.js')
      .catch(() => undefined)
      .finally(() => initThreeScene())
  }, [])

  return (
    <>
      <Overlays />
      <SiteHeader />
      <main id="main">
        <IntroTitleCard />
        <Hero />
        <Features />
        <MeetNolan />
        <HowItWorks />
        <Mission />
        <Showcase />
        <CallToAction />
      </main>
      <SiteFooter />
    </>
  )
}

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.onload = () => resolve()
    script.onerror = reject
    document.head.appendChild(script)
  })
}
