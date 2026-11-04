/* IntroTitleCard: converted from the original index.html. Edit the text and markup here. */
export function IntroTitleCard() {
  return (
    <>
  {/* =========================================================
           0. INTRO TITLE CARD
           The page opens on the app name. Scrolling plays the intro
           (title zooms + fades, letterbox bars retract), then the hero appears.
           Scroll length = .intro height in src/styles.css.
           ========================================================= */}
      <section className="intro" id="intro" aria-label="ReFrame title card">
        <div className="intro__sticky">
          <div className="intro__glow" aria-hidden="true"></div>
          <span className="intro__bar intro__bar--top" aria-hidden="true"></span>
          <span className="intro__bar intro__bar--bottom" aria-hidden="true"></span>
          <span className="intro__corner intro__corner--tl" aria-hidden="true"></span>
          <span className="intro__corner intro__corner--tr" aria-hidden="true"></span>
          <span className="intro__corner intro__corner--bl" aria-hidden="true"></span>
          <span className="intro__corner intro__corner--br" aria-hidden="true"></span>

          <div className="intro__content">
            <div className="intro__meta intro__meta--top">
              <p className="intro__line">A film education app · 2026</p>
            </div>
            <p className="intro__title">
              <span className="sr-only">ReFrame</span>
              <span className="intro__chars" aria-hidden="true"><span>R</span><span>e</span><em><span>F</span><span>r</span><span>a</span><span>m</span><span>e</span></em></span>
            </p>
            <div className="intro__meta">
              <p className="intro__line intro__line--serif">Every frame has a <em>reason.</em></p>
            </div>
          </div>

          {/* Clicking "Scroll" plays the intro and takes you to the site */}
          <button className="intro__meta intro__cue" id="intro-cue" type="button" aria-label="Skip the title card and go to the site">
            <span className="intro__line">Scroll</span>
            <i aria-hidden="true"></i>
          </button>
        </div>
      </section>


    </>
  )
}
