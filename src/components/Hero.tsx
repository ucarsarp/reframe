/* Hero: converted from the original index.html. Edit the text and markup here. */
export function Hero() {
  return (
    <>
  {/* =========================================================
           2. HERO
           ========================================================= */}
      <section className="hero" id="top" aria-labelledby="hero-title">
        {/* 3D film camera + stage lights, drawn by three-scene.js behind the hero content */}
        <canvas className="hero__canvas" id="hero-canvas" aria-hidden="true"></canvas>

        <div className="container">
          <p className="eyebrow hero__eyebrow" data-hero="">Film education, reframed</p>

          {/* Each .line animates in on load. Edit the words inside the inner <span>s. */}
          <h1 className="hero__title" id="hero-title">
            <span className="line"><span>Learn to <em>read</em></span></span>
            <span className="line"><span>the language</span></span>
            <span className="line"><span>of <em>film.</em></span></span>
          </h1>

          <div className="hero__bottom">
            <p className="hero__sub" data-hero="">
              Upload any frame and ReFrame breaks it down: shot, angle, light, and why the director chose it.
            </p>
            <div className="hero__actions" data-hero="">
              <a href="#download" className="btn btn--primary">Download</a>
              <a href="#features" className="btn btn--ghost">Learn more <span className="btn__arrow" aria-hidden="true">↓</span></a>
            </div>
          </div>
        </div>

        {/* Hero still: a frame from Oppenheimer with ReFrame's analysis on top (swap for an app video later) */}
        <div className="container">
          <figure className="hero__media" data-hero="">
            <div className="frame frame--hero">
              <div className="frame__still" data-parallax="0.12">
                <img className="frame__img frame__img--hero" src="/images/oppenheimer.jpg" alt="Still from Oppenheimer (2023): J. Robert Oppenheimer in a medium close-up at dusk, filmed from slightly below, with a stone campus building behind him" />
                <div className="frame__grid" aria-hidden="true"></div>
              </div>
              {/* Mock analysis overlay, matched to this shot */}
              <div className="frame__panel" aria-hidden="true">
                <span className="tag">Medium close-up</span>
                <span className="tag">Low angle</span>
                <span className="tag">Dusk light · soft</span>
                <p className="frame__note">Intent: shot from below in fading light, he already looms over us, and already looks haunted.</p>
              </div>
              <span className="frame__corner frame__corner--tl" aria-hidden="true"></span>
              <span className="frame__corner frame__corner--tr" aria-hidden="true"></span>
              <span className="frame__corner frame__corner--bl" aria-hidden="true"></span>
              <span className="frame__corner frame__corner--br" aria-hidden="true"></span>
              <span className="frame__label" aria-hidden="true">Oppenheimer (2023) · Christopher Nolan</span>
            </div>
          </figure>
        </div>
      </section>

      {/* Scrolling ticker of film terms (decorative) */}
      <div className="ticker" aria-hidden="true">
        <div className="ticker__track">
          <span>Extreme wide</span><span>Dutch angle</span><span>Chiaroscuro</span><span>Rule of thirds</span><span>Over the shoulder</span><span>Rim light</span><span>Dolly zoom</span><span>Negative space</span>
          <span>Extreme wide</span><span>Dutch angle</span><span>Chiaroscuro</span><span>Rule of thirds</span><span>Over the shoulder</span><span>Rim light</span><span>Dolly zoom</span><span>Negative space</span>
        </div>
      </div>


    </>
  )
}
