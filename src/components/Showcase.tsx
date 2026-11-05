/* Showcase: converted from the original index.html. Edit the text and markup here. */
import { NolanMark } from './Logos'
export function Showcase() {
  return (
    <>
  {/* =========================================================
           6. SHOWCASE (screens scroll sideways on their own)
           ========================================================= */}
      <section className="showcase" id="showcase" aria-labelledby="showcase-title">
        <div className="container">
          <header className="section__head" data-reveal="">
            <p className="eyebrow">Scene 05 — Showcase</p>
            <h2 className="section__title" id="showcase-title" data-split="">See it <em>in action.</em></h2>
            <p className="showcase__hint">Drag, swipe or use the arrows →</p>
          </header>
        </div>

        <div className="showcase__stage" data-scale="">
          {/* App screen mockups, built in HTML/CSS (see "App screen mockups" in src/styles.css).
               Sizes use cqw (1cqw = 1% of the screen width), so they scale with the screen.
               To use real screenshots later, replace a .ui block with <img src="..." alt="..." /> */}
          {/* Scroll the page down as normal; move through the screens sideways here
               (drag with the mouse, swipe, shift + wheel, arrow keys or the buttons below) */}
          <div className="showcase__scroller" id="showcase-scroller" tabIndex={0} aria-label="App screens. Scroll sideways to see all six.">
          <div className="showcase__row">

            {/* Screen 1: Upload */}
            <figure className="shot">
              <div className="screen" role="img" aria-label="App screen: upload a still or pick a frame from the film library">
                <div className="ui">
                <div className="ui-status"><span>9:41</span><span className="ui-status__icons"><i></i><i></i><b></b></span></div>
                <div className="ui-body">
                  <p className="ui-kicker">New analysis</p>
                  <p className="ui-title">What are we <em>watching?</em></p>
                  <div className="ui-drop">
                    <span className="ui-drop__plus">+</span>
                    <span className="ui-drop__title">Upload a still</span>
                    <span className="ui-small">JPG or PNG · camera roll</span>
                  </div>
                  <p className="ui-kicker">Or pick from the library</p>
                  <div className="ui-library">
                    <span className="ui-tile"><img src="/images/oppenheimer.jpg" alt="" /><span>Oppenheimer</span></span>
                    <span className="ui-tile"><img src="/images/babylon.jpg" alt="" /><span>Babylon</span></span>
                    <span className="ui-tile"><img src="/images/do-the-right-thing.jpg" alt="" /><span>Do the Right Thing</span></span>
                    <span className="ui-tile"><img src="/images/in-the-mood-for-love.jpg" alt="" /><span>In the Mood for Love</span></span>
                  </div>
                </div>
                <div className="ui-tabs">
                  <span className="ui-tab is-active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" /><circle cx="12" cy="12" r="3" /></svg>Analyse</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z" /></svg>Lessons</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3" /></svg>Recreate</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4" /></svg>Progress</span>
                </div>
                </div>
              </div>
              <figcaption className="shot__caption"><span>01</span> Upload</figcaption>
            </figure>

            {/* Screen 2: Analysis */}
            <figure className="shot">
              <div className="screen screen--tall" role="img" aria-label="App screen: AI analysis of a Get Out still showing shot type, angle, lighting and the director's intent">
                <div className="ui">
                <div className="ui-status"><span>9:41</span><span className="ui-status__icons"><i></i><i></i><b></b></span></div>
                <div className="ui-body">
                  <div className="ui-still"><img src="/images/get-out.jpg" alt="" /></div>
                  <div className="ui-row">
                    <p className="ui-film"><em>Get Out</em></p>
                    <p className="ui-small">2017 · Jordan Peele</p>
                  </div>
                  <div className="ui-chips">
                    <span className="ui-chip">Extreme close-up</span>
                    <span className="ui-chip">Eye level</span>
                    <span className="ui-chip">Low-key light</span>
                    <span className="ui-chip">Centre framing</span>
                  </div>
                  <div className="ui-meter"><span className="ui-small">Shot match</span><span className="ui-meter__bar"><i style={{ width: '94%' }}></i></span><span className="ui-small">94%</span></div>
                  <div className="ui-card">
                    <p className="ui-kicker">Director's intent</p>
                    <p className="ui-quote">The centred, unbroken stare traps us inside Chris's paralysis. We can't look away either.</p>
                  </div>
                  <span className="ui-btn">Open lesson →</span>
                </div>
                <div className="ui-tabs">
                  <span className="ui-tab is-active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" /><circle cx="12" cy="12" r="3" /></svg>Analyse</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z" /></svg>Lessons</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3" /></svg>Recreate</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4" /></svg>Progress</span>
                </div>
                </div>
              </div>
              <figcaption className="shot__caption"><span>02</span> Analysis</figcaption>
            </figure>

            {/* Screen: Nolan (AI tutor) */}
            <figure className="shot">
              <div className="screen screen--tall" role="img" aria-label="App screen: Nolan, the AI film tutor, recognising a Get Out still, explaining how it was filmed and answering a question">
                <div className="ui">
                <div className="ui-status"><span>9:41</span><span className="ui-status__icons"><i></i><i></i><b></b></span></div>
                <div className="ui-body">
                  <p className="ui-kicker">✦ Nolan · AI film tutor</p>
                  <div className="ui-card ui-rec">
                    <span className="ui-rec__img"><img src="/images/get-out.jpg" alt="" /></span>
                    <span className="ui-rec__text">
                      <span className="ui-kicker ui-red">Recognised · 96%</span>
                      <span className="ui-film"><em>Get Out</em></span>
                      <span className="ui-small">2017 · Jordan Peele</span>
                    </span>
                  </div>
                  <div className="ui-facts">
                    <span><b>Camera</b>Eye level, centred</span>
                    <span><b>Lens</b>Wide aperture</span>
                    <span><b>Light</b>One soft key</span>
                    <span><b>Move</b>Slow push-in</span>
                  </div>
                  <span className="ui-bubble ui-bubble--you">Why so claustrophobic?</span>
                  <span className="ui-nolan-row"><span className="ui-nolan"><NolanMark /></span><span className="ui-bubble ui-bubble--nolan">No headroom, no room at the sides, and the background falls into darkness. Nowhere to escape, just like Chris.</span></span>
                  <span className="ui-ask"><span>Ask Nolan about this shot…</span><i>↑</i></span>
                </div>
                <div className="ui-tabs">
                  <span className="ui-tab is-active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" /><circle cx="12" cy="12" r="3" /></svg>Analyse</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z" /></svg>Lessons</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3" /></svg>Recreate</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4" /></svg>Progress</span>
                </div>
                </div>
              </div>
              <figcaption className="shot__caption"><span>03</span> Nolan <em className="ui-red">AI</em></figcaption>
            </figure>

            {/* Screen 3: Lesson */}
            <figure className="shot">
              <div className="screen" role="img" aria-label="App screen: a four-minute lesson on shallow depth of field, using a still from The Social Network">
                <div className="ui">
                <div className="ui-status"><span>9:41</span><span className="ui-status__icons"><i></i><i></i><b></b></span></div>
                <div className="ui-body">
                  <p className="ui-kicker">Lesson 04 · 4 min</p>
                  <p className="ui-title">Shallow <em>depth</em> of field</p>
                  <div className="ui-steps"><i className="is-done"></i><i className="is-done"></i><i></i><i></i><i></i></div>
                  <div className="ui-still ui-still--plain"><img src="/images/social-network.jpg" alt="" /></div>
                  <p className="ui-text">A wide aperture keeps only one plane sharp. Fincher puts the equation in focus and lets the people blur: the idea matters more than them.</p>
                  <div className="ui-card ui-diagram">
                    <svg viewBox="0 0 200 64" fill="none" stroke="currentColor" strokeWidth="1">
                      <ellipse cx="30" cy="32" rx="6" ry="22" />
                      <path d="M36 12 L120 32 L36 52" strokeOpacity=".5" />
                      <path d="M120 8 V56" stroke="#c23a2b" strokeWidth="1.5" />
                      <path d="M150 14 V50 M180 18 V46" strokeOpacity=".25" strokeDasharray="3 3" />
                    </svg>
                    <span className="ui-small">f/1.8 · focus plane · blur</span>
                  </div>
                  <span className="ui-btn">Mark as learned</span>
                </div>
                <div className="ui-tabs">
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" /><circle cx="12" cy="12" r="3" /></svg>Analyse</span>
                  <span className="ui-tab is-active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z" /></svg>Lessons</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3" /></svg>Recreate</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4" /></svg>Progress</span>
                </div>
                </div>
              </div>
              <figcaption className="shot__caption"><span>04</span> Lesson</figcaption>
            </figure>

            {/* Screen 4: Recreate */}
            <figure className="shot">
              <div className="screen screen--tall" role="img" aria-label="App screen: guide to recreating the Phantom Thread spotlight shot with a phone and a desk lamp">
                <div className="ui">
                <div className="ui-status"><span>9:41</span><span className="ui-status__icons"><i></i><i></i><b></b></span></div>
                <div className="ui-body">
                  <p className="ui-kicker">Recreate · Phantom Thread</p>
                  <p className="ui-title">One beam, <em>one lamp.</em></p>
                  <div className="ui-compare">
                    <span className="ui-compare__item"><img src="/images/phantom-thread.jpg" alt="" /><span className="ui-small">Original</span></span>
                    <span className="ui-compare__item ui-compare__item--empty">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4"><rect x="2" y="6" width="20" height="14" rx="2" /><circle cx="12" cy="13" r="4" /><path d="M8 6l2-3h4l2 3" /></svg>
                      <span className="ui-small">Your take</span>
                    </span>
                  </div>
                  <ul className="ui-checklist">
                    <li className="is-done">Phone at chest height</li>
                    <li className="is-done">One lamp, high and behind</li>
                    <li>Ceiling lights off, a little haze</li>
                  </ul>
                  <div className="ui-chips">
                    <span className="ui-chip">Phone</span>
                    <span className="ui-chip">Desk lamp</span>
                    <span className="ui-chip">Baking paper</span>
                  </div>
                  <span className="ui-btn ui-btn--red">Open camera</span>
                </div>
                <div className="ui-tabs">
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" /><circle cx="12" cy="12" r="3" /></svg>Analyse</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z" /></svg>Lessons</span>
                  <span className="ui-tab is-active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3" /></svg>Recreate</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4" /></svg>Progress</span>
                </div>
                </div>
              </div>
              <figcaption className="shot__caption"><span>05</span> Recreate</figcaption>
            </figure>

            {/* Screen 5: Progress */}
            <figure className="shot">
              <div className="screen" role="img" aria-label="App screen: learning progress with shots analysed, a streak, a weekly chart and skill levels">
                <div className="ui">
                <div className="ui-status"><span>9:41</span><span className="ui-status__icons"><i></i><i></i><b></b></span></div>
                <div className="ui-body">
                  <p className="ui-kicker">Your reel</p>
                  <p className="ui-title">23 shots <em>read.</em></p>
                  <div className="ui-card ui-streak">
                    <span className="ui-small">7-day streak</span>
                    <span className="ui-streak__dots"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></span>
                  </div>
                  <div className="ui-card ui-chart">
                    <svg viewBox="0 0 200 70" preserveAspectRatio="none">
                      <path d="M0 62 L28 55 L57 58 L85 44 L114 40 L142 28 L171 22 L200 10 L200 70 L0 70 Z" fill="#c23a2b" fillOpacity=".18" />
                      <path d="M0 62 L28 55 L57 58 L85 44 L114 40 L142 28 L171 22 L200 10" fill="none" stroke="#c23a2b" strokeWidth="2" />
                    </svg>
                    <span className="ui-small">Shots per week · last 8 weeks</span>
                  </div>
                  <div className="ui-skill"><span className="ui-small">Lighting</span><span className="ui-meter__bar"><i style={{ width: '80%' }}></i></span></div>
                  <div className="ui-skill"><span className="ui-small">Composition</span><span className="ui-meter__bar"><i style={{ width: '65%' }}></i></span></div>
                  <div className="ui-skill"><span className="ui-small">Movement</span><span className="ui-meter__bar"><i style={{ width: '30%' }}></i></span></div>
                </div>
                <div className="ui-tabs">
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 8V3h5M16 3h5v5M21 16v5h-5M8 21H3v-5" /><circle cx="12" cy="12" r="3" /></svg>Analyse</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 5h7a2 2 0 0 1 2 2v13a2 2 0 0 0-2-2H3zM21 5h-7a2 2 0 0 0-2 2v13a2 2 0 0 1 2-2h7z" /></svg>Lessons</span>
                  <span className="ui-tab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="2" y="6" width="14" height="12" rx="2" /><path d="M16 10l6-3v10l-6-3" /></svg>Recreate</span>
                  <span className="ui-tab is-active"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 20h18M6 16v-5M11 16V7M16 16v-8M21 16V4" /></svg>Progress</span>
                </div>
                </div>
              </div>
              <figcaption className="shot__caption"><span>06</span> Progress</figcaption>
            </figure>
          </div>
          </div>

          <div className="showcase__controls">
            <button className="showcase__btn" id="showcase-prev" aria-label="Previous screen">←</button>
            <span className="showcase__count" id="showcase-count" aria-live="polite">01 / 06</span>
            <button className="showcase__btn" id="showcase-next" aria-label="Next screen">→</button>
          </div>
        </div>
      </section>


    </>
  )
}
