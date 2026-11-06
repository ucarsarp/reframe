/* SiteFooter: the end credits. Edit the text and markup here.
   Layout, top to bottom: credit columns · closing line + popcorn · giant wordmark · bottom bar.
   The faint grid and projector beam behind it all are drawn in styles.css (.footer). */

// The films whose stills appear on the page (credited in column d)
const FILMS = [
  ['In the Mood for Love', 'Wong Kar-wai'],
  ['Get Out', 'Jordan Peele'],
  ['The Social Network', 'David Fincher'],
  ['Phantom Thread', 'Paul Thomas Anderson'],
  ['Oppenheimer', 'Christopher Nolan'],
  ['Babylon', 'Damien Chazelle'],
  ['Do the Right Thing', 'Spike Lee'],
]

export function SiteFooter() {
  return (
    <>
  {/* =========================================================
         8. FOOTER · the end credits
         ========================================================= */}
    <footer className="footer" id="credits">
      {/* Credit columns, labelled like a film's end titles */}
      <div className="footer__wide footer__cols" data-reveal="">
        <nav className="footer__col" aria-label="Footer">
          <p className="footer__head">(a.) Explore</p>
          <ul>
            <li><a className="link" href="#features">Features</a></li>
            <li><a className="link" href="#nolan">Nolan <span className="nav__ai">AI</span></a></li>
            <li><a className="link" href="#how">How it works</a></li>
            <li><a className="link" href="#mission">Mission</a></li>
            <li><a className="link" href="#showcase">Showcase</a></li>
          </ul>
        </nav>
        <div className="footer__col">
          <p className="footer__head">(b.) Premiere</p>
          <p>18.11.26 · 12:30</p>
          <p>iOS &amp; Android</p>
          <p><a className="link" href="#download">Download →</a></p>
        </div>
        <div className="footer__col">
          <p className="footer__head">(c.) Contact</p>
          <ul>
            <li><a className="link" href="#">Contact</a></li>
            <li><a className="link" href="#">Privacy</a></li>
            <li><a className="link" href="https://github.com/ucarsarp/reframe">GitHub</a></li>
          </ul>
        </div>
        <div className="footer__col footer__col--credits">
          <p className="footer__head">(d.) Credits</p>
          <ul>
            {FILMS.map(([film, director]) => (
              <li key={film}><em>{film}</em> · {director}</li>
            ))}
          </ul>
          <p className="footer__fine">Stills used for teaching. Nolan is named in homage to Christopher Nolan and isn't affiliated with him.</p>
        </div>
      </div>

      {/* Closing credit */}
      <div className="container footer__inner">
        <p className="footer__credit" data-reveal=""><span className="eyebrow">A film education by ReFrame</span><br />Directed by <em>you.</em></p>
      </div>

      {/* Popcorn finale: when this scrolls into view, kernels pop out of the bucket
           and pile up (canvas, drawn by src/lib/site.js → "Popcorn finale").
           Click the bucket to pop more. */}
      <div className="popcorn" id="popcorn">
        <canvas className="popcorn__canvas" id="popcorn-canvas" aria-hidden="true"></canvas>
        <p className="popcorn__label"><span>Intermission</span> · enjoy the show</p>
        <button className="popcorn__bucket" id="popcorn-bucket" type="button" aria-label="Pop more popcorn">
          <svg viewBox="0 0 170 190" aria-hidden="true">
            <defs>
              <clipPath id="bucket-shape"><path d="M8 26 L162 26 L140 186 L30 186 Z" /></clipPath>
            </defs>
            <g clipPath="url(#bucket-shape)">
              <rect x="0" y="20" width="170" height="170" fill="#f5f5f3" />
              <rect x="8" y="20" width="22" height="170" fill="#c23a2b" />
              <rect x="52" y="20" width="22" height="170" fill="#c23a2b" />
              <rect x="96" y="20" width="22" height="170" fill="#c23a2b" />
              <rect x="140" y="20" width="22" height="170" fill="#c23a2b" />
              {/* soft shading so it reads as round */}
              <rect x="0" y="20" width="170" height="170" fill="url(#bucket-shade)" />
            </g>
            <defs>
              <linearGradient id="bucket-shade" x1="0" x2="1">
                <stop offset="0" stopColor="#000" stopOpacity="0.35" />
                <stop offset="0.35" stopColor="#000" stopOpacity="0" />
                <stop offset="0.7" stopColor="#000" stopOpacity="0" />
                <stop offset="1" stopColor="#000" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* rim */}
            <rect x="4" y="18" width="162" height="12" rx="6" fill="#f5f5f3" />
            <rect x="4" y="18" width="162" height="12" rx="6" fill="url(#bucket-shade)" />
            {/* label */}
            <ellipse cx="85" cy="104" rx="46" ry="22" fill="#0a0a0a" />
            <text x="85" y="111" textAnchor="middle" fontFamily="Instrument Serif, Georgia, serif" fontSize="22" fill="#f5f5f3">Re<tspan fontStyle="italic">Frame</tspan></text>
          </svg>
        </button>
        <p className="popcorn__hint">Click the bucket for more</p>
      </div>

      {/* Giant wordmark between letterbox lines, the way the film ends on its title */}
      <div className="footer__wide footer__title" data-reveal="">
        <p className="footer__ratio"><span>2.39 : 1</span><span><i aria-hidden="true"></i>REC</span></p>
        <a href="#top" className="footer__word" aria-label="ReFrame, back to top">Re<em>Frame</em></a>
      </div>

      {/* Bottom bar */}
      <div className="footer__wide footer__bar">
        <p>&copy; <span id="year">2026</span> ReFrame. All rights reserved.</p>
        <p className="footer__scene">Scene 07 / The end</p>
        <a className="link" href="#top">Back to top ↑</a>
      </div>
    </footer>


    </>
  )
}
