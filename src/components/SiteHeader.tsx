/* SiteHeader: converted from the original index.html. Edit the text and markup here. */
export function SiteHeader() {
  return (
    <>
  {/* =========================================================
         1. NAVIGATION
         ========================================================= */}
    <header className="nav" id="nav">
      {/* Launch countdown bar. The target date/time is set in script.js (LAUNCH_DATE). */}
      <div className="launch-bar" id="launch-bar">
        <div className="launch-bar__inner container">
          <p className="launch-bar__label">ReFrame goes live in</p>
          <div className="countdown" role="timer" aria-live="off" aria-label="Time until ReFrame launches on 18 November 2026 at 12:00">
            <span className="countdown__unit"><span className="countdown__num" data-unit="days">--</span><span className="countdown__tag">d</span></span>
            <span className="countdown__sep" aria-hidden="true">:</span>
            <span className="countdown__unit"><span className="countdown__num" data-unit="hours">--</span><span className="countdown__tag">h</span></span>
            <span className="countdown__sep" aria-hidden="true">:</span>
            <span className="countdown__unit"><span className="countdown__num" data-unit="minutes">--</span><span className="countdown__tag">m</span></span>
            <span className="countdown__sep" aria-hidden="true">:</span>
            <span className="countdown__unit"><span className="countdown__num" data-unit="seconds">--</span><span className="countdown__tag">s</span></span>
          </div>
          <p className="launch-bar__date">18.11.26 · 12:30
          </p>
        </div>
      </div>

      {/* Three columns: [menu toggle on mobile] [logo + links, centered] [Download on the right] */}
      <div className="nav__inner container">
        <button className="nav__toggle" aria-expanded="false" aria-controls="nav-menu">
          <span className="sr-only">Open menu</span>
          <span className="nav__toggle-bar"></span>
          <span className="nav__toggle-bar"></span>
        </button>

        <div className="nav__center">
          <a href="#top" className="nav__logo" aria-label="ReFrame, back to top">Re<span>Frame</span></a>
          <nav className="nav__menu" id="nav-menu" aria-label="Primary">
            <ul className="nav__links">
              <li><a className="link" href="#features">Features</a></li>
              <li><a className="link" href="#nolan">Nolan <span className="nav__ai">AI</span></a></li>
              <li><a className="link" href="#how">How it works</a></li>
              <li><a className="link" href="#mission">Mission</a></li>
              <li><a className="link" href="#showcase">Showcase</a></li>
            </ul>
          </nav>
        </div>

        <a href="#download" className="btn btn--primary btn--sm nav__cta">Download</a>
      </div>
    </header>



    </>
  )
}
