/* Features: converted from the original index.html. Edit the text and markup here. */
export function Features() {
  return (
    <>
  {/* =========================================================
           3. FEATURES (alternating left / right)
           ========================================================= */}
      <section className="section features" id="features" aria-labelledby="features-title">
        <div className="container">
          <header className="section__head" data-reveal="">
            <p className="eyebrow">Scene 01 — Features</p>
            <h2 className="section__title" id="features-title" data-split="">Every frame is a <em>lesson.</em></h2>
          </header>

          {/* Four centered feature cards (row on desktop, 2×2 on tablet, column on phones) */}
          <div className="features__grid">
          {/* Feature 1 */}
          <article className="feature" data-reveal="">
            <div className="feature__text">
              <div className="feature__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 10V4h6M22 4h6v6M28 22v6h-6M10 28H4v-6" /><circle cx="16" cy="16" r="4" /></svg>
              </div>
              <h3 className="feature__title">Shot analysis</h3>
              <p className="feature__desc">Get an instant breakdown of shot type, camera angle and lighting setup for any still you upload or any frame you pick from a film.</p>
            </div>
            <figure className="feature__media">
              <div className="frame frame--a">
                {/* Film still: drop the file into images/ (see images/README.txt). Placeholder shows until it exists. */}
                <div className="frame__still" data-parallax="0.05">
                  <img className="frame__img" src="/images/in-the-mood-for-love.jpg" alt="Still from In the Mood for Love (2000): a man seen in a mirror on the left, a woman in a patterned qipao sitting on a red bed on the right, both lit by warm lamplight" />
                  <div className="frame__grid" aria-hidden="true"></div>
                </div>
              </div>
              <figcaption className="feature__credit"><em>In the Mood for Love</em> (2000) · Wong Kar-wai</figcaption>
            </figure>
          </article>

          {/* Feature 2 (reversed) */}
          <article className="feature feature--reverse" data-reveal="">
            <div className="feature__text">
              <div className="feature__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M2 16s5-9 14-9 14 9 14 9-5 9-14 9S2 16 2 16z" /><circle cx="16" cy="16" r="4" /></svg>
              </div>
              <h3 className="feature__title">Director's intent</h3>
              <p className="feature__desc">Go past "it looks good." ReFrame explains why a shot was framed the way it was and what the director wanted you to feel.</p>
            </div>
            <figure className="feature__media">
              <div className="frame frame--b">
                {/* Film still: drop the file into images/ (see images/README.txt). Placeholder shows until it exists. */}
                <div className="frame__still" data-parallax="0.05">
                  <img className="frame__img" src="/images/get-out.jpg" alt="Still from Get Out (2017): a tight, dead-centre close-up of Chris frozen in an armchair, eyes wide and tears running down his face in a dim room" />
                  <div className="frame__grid" aria-hidden="true"></div>
                </div>
              </div>
              <figcaption className="feature__credit"><em>Get Out</em> (2017) · Jordan Peele</figcaption>
            </figure>
          </article>

          {/* Feature 3 */}
          <article className="feature" data-reveal="">
            <div className="feature__text">
              <div className="feature__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 6h10a2 2 0 0 1 2 2v18a2 2 0 0 0-2-2H4zM28 6H18a2 2 0 0 0-2 2v18a2 2 0 0 1 2-2h10z" /></svg>
              </div>
              <h3 className="feature__title">Short lessons</h3>
              <p className="feature__desc">Every result links to a bite-sized lesson on the technique behind it, so each analysis teaches you something you keep.</p>
            </div>
            <figure className="feature__media">
              <div className="frame frame--c">
                {/* Film still: drop the file into images/ (see images/README.txt). Placeholder shows until it exists. */}
                <div className="frame__still" data-parallax="0.05">
                  <img className="frame__img" src="/images/social-network.jpg" alt="Still from The Social Network (2010): a hand writing an equation on a window in sharp focus while the faces behind it fall into soft, shallow-focus blur" />
                  <div className="frame__grid" aria-hidden="true"></div>
                </div>
              </div>
              <figcaption className="feature__credit"><em>The Social Network</em> (2010) · David Fincher</figcaption>
            </figure>
          </article>

          {/* Feature 4 (reversed) */}
          <article className="feature feature--reverse" data-reveal="">
            <div className="feature__text">
              <div className="feature__icon" aria-hidden="true">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="9" width="20" height="16" rx="2" /><path d="M23 14l6-4v14l-6-4" /><circle cx="13" cy="17" r="3.5" /></svg>
              </div>
              <h3 className="feature__title">Recreate the shot</h3>
              <p className="feature__desc">Step-by-step guides show you how to rebuild the shot with a phone, a desk lamp and whatever you have at home. No pro gear required.</p>
            </div>
            <figure className="feature__media">
              <div className="frame frame--d">
                {/* Film still: drop the file into images/ (see images/README.txt). Placeholder shows until it exists. */}
                <div className="frame__still" data-parallax="0.05">
                  <img className="frame__img" src="/images/phantom-thread.jpg" alt="Still from Phantom Thread (2017): a couple embracing in an empty ballroom scattered with balloons, a single spotlight beam cutting through the haze" />
                  <div className="frame__grid" aria-hidden="true"></div>
                </div>
              </div>
              <figcaption className="feature__credit"><em>Phantom Thread</em> (2017) · Paul Thomas Anderson</figcaption>
            </figure>
          </article>
          </div>
        </div>
      </section>



    </>
  )
}
