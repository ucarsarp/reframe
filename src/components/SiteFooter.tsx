/* SiteFooter: converted from the original index.html. Edit the text and markup here. */
export function SiteFooter() {
  return (
    <>
  {/* =========================================================
         8. FOOTER
         ========================================================= */}
    <footer className="footer">
      <div className="container footer__inner">
        {/* Closing credit */}
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

      <div className="container footer__inner footer__inner--bottom">
        <a href="#top" className="nav__logo footer__logo">Re<span>Frame</span></a>
        <ul className="footer__links">
          <li><a className="link" href="#features">Features</a></li>
          <li><a className="link" href="#nolan">Nolan</a></li>
          <li><a className="link" href="#mission">Mission</a></li>
          <li><a className="link" href="#">Privacy</a></li>
          <li><a className="link" href="#">Contact</a></li>
        </ul>
        <p className="footer__copy">&copy; <span id="year">2026</span> ReFrame. All rights reserved.</p>
      </div>
    </footer>


    </>
  )
}
