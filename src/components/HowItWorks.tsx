/* HowItWorks: converted from the original index.html. Edit the text and markup here. */
export function HowItWorks() {
  return (
    <>
  {/* =========================================================
           4. HOW IT WORKS
           ========================================================= */}
      <section className="section how" id="how" aria-labelledby="how-title">
        <div className="container">
          <header className="section__head" data-reveal="">
            <p className="eyebrow">Scene 03 — How it works</p>
            <h2 className="section__title" id="how-title" data-split="">Three steps from <em>watching</em> to <em>making.</em></h2>
          </header>

          <ol className="steps">
            <li className="step" data-reveal="">
              <span className="step__num">i.</span>
              <h3 className="step__title">Upload or pick a frame</h3>
              <p className="step__desc">Drop in a still from your camera roll or choose a moment from a film in the library.</p>
            </li>
            <li className="step" data-reveal="">
              <span className="step__num">ii.</span>
              <h3 className="step__title">Ask <em>Nolan</em> for the breakdown</h3>
              <p className="step__desc">Nolan, the AI tutor, reads the shot type, angle, lighting and the director's likely intent in seconds.</p>
            </li>
            <li className="step" data-reveal="">
              <span className="step__num">iii.</span>
              <h3 className="step__title">Learn and recreate</h3>
              <p className="step__desc">Open the linked lesson, then try the shot yourself with the gear you already own.</p>
            </li>
          </ol>
        </div>
      </section>

      {/* Two rows of giant italic words that slide in opposite directions as you scroll (decorative) */}
      <div className="scroll-band" aria-hidden="true">
        <div className="scroll-band__row" data-band="1">Light <i>✦</i> Shadow <i>✦</i> Framing <i>✦</i> Colour <i>✦</i> Light <i>✦</i> Shadow <i>✦</i> Framing <i>✦</i> Colour <i>✦</i></div>
        <div className="scroll-band__row scroll-band__row--outline" data-band="-1">Intent <i>✦</i> Blocking <i>✦</i> Rhythm <i>✦</i> Mood <i>✦</i> Intent <i>✦</i> Blocking <i>✦</i> Rhythm <i>✦</i> Mood <i>✦</i></div>
      </div>


    </>
  )
}
