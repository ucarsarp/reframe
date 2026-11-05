/* MeetNolan: converted from the original index.html. Edit the text and markup here. */
import { NolanMark } from './Logos'
export function MeetNolan() {
  return (
    <>
  {/* =========================================================
           3b. NOLAN · the AI film tutor (named after Christopher Nolan)
           The chat demo below plays when it scrolls into view (src/lib/site.js, "Nolan chat demo").
           ========================================================= */}
      <section className="section nolan" id="nolan" aria-labelledby="nolan-title">
        <div className="container nolan__inner">
          <header className="section__head" data-reveal="">
            <p className="eyebrow">Scene 02 — Meet Nolan</p>
            <h2 className="section__title" id="nolan-title" data-split="">Ask <em>Nolan.</em></h2>
            <p className="nolan__lede">ReFrame's AI film tutor, named after Christopher Nolan. Point your phone at any screen and Nolan tells you what you're watching, how it was filmed, and why it works.</p>
          </header>

          <div className="nolan__stage" data-reveal="">
            <div className="nolan__avatar" aria-hidden="true"><NolanMark /></div>

            {/* Example conversation */}
            <div className="nolan-chat" id="nolan-chat" aria-label="Example conversation with Nolan">
              <div className="nolan-chat__rec">
                <img src="/images/get-out.jpg" alt="Still from Get Out (2017): a tight, centred close-up of Chris with tears on his face" />
                <div>
                  <p className="nolan-chat__match">✦ Nolan recognised · 96% match</p>
                  <p className="nolan-chat__film"><em>Get Out</em></p>
                  <p className="nolan-chat__meta">2017 · Jordan Peele · the hypnosis scene</p>
                </div>
              </div>
              <ul className="nolan-chat__facts">
                <li><span>Camera</span>Locked off at eye level</li>
                <li><span>Lens</span>Wide aperture, tight on the face</li>
                <li><span>Light</span>One soft key, dark surround</li>
                <li><span>Movement</span>Slow push-in</li>
              </ul>
              <p className="nolan-chat__you" data-step="">Why does it feel so claustrophobic?</p>
              <div className="nolan-chat__reply" data-step="">
                <span className="nolan-chat__mini" aria-hidden="true"><NolanMark /></span>
                <div className="nolan-chat__bubble">
                  <span className="nolan-chat__name">Nolan</span>
                  <span className="nolan-chat__typing" aria-hidden="true"><i></i><i></i><i></i></span>
                  <span className="nolan-chat__answer">The frame is almost all face: no headroom, no space to the sides, and the background falls into darkness. There's nowhere for your eye to escape, just like Chris.</span>
                </div>
              </div>
              {/* Live conversation: new questions and Nolan's streamed answers go here (src/lib/site.js, "Nolan live chat") */}
              <div className="nolan-chat__thread" id="nolan-thread" aria-live="polite"></div>
              <div className="nolan-chat__chips" data-step="">
                <button type="button">Show me a similar shot</button><button type="button">How do I light this?</button><button type="button">What lens is this?</button>
              </div>
              <form className="nolan-chat__form" id="nolan-form" data-step="">
                <label className="nolan-chat__attach" title="Attach a film still">
                  <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" />
                  <span aria-hidden="true">+</span><span className="sr-only">Attach a film still</span>
                </label>
                <input className="nolan-chat__input" type="text" name="question" placeholder="Ask Nolan about a shot…" autoComplete="off" maxLength={1000} aria-label="Your question for Nolan" />
                <button className="nolan-chat__send" type="submit">Ask</button>
              </form>
              <p className="nolan-chat__file" id="nolan-file" hidden></p>
            </div>
          </div>

          {/* What Nolan does */}
          <div className="nolan__abilities">
            <article className="ability" data-reveal="">
              <span className="ability__num">01</span>
              <h3 className="ability__title">Recognise</h3>
              <p className="ability__desc">Point your phone at a TV or laptop, or upload a still. Nolan names the film, the director and the scene.</p>
            </article>
            <article className="ability" data-reveal="">
              <span className="ability__num">02</span>
              <h3 className="ability__title">Explain</h3>
              <p className="ability__desc">Camera, lens, light and movement: how the shot was likely made, in plain words, not jargon.</p>
            </article>
            <article className="ability" data-reveal="">
              <span className="ability__num">03</span>
              <h3 className="ability__title">Answer</h3>
              <p className="ability__desc">Ask anything about the frame. Nolan answers like a tutor, then links the lesson and a way to recreate it.</p>
            </article>
          </div>
        </div>
      </section>


    </>
  )
}
