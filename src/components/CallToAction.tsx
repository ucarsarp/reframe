/* CallToAction: the final "Download" section, with a "Now showing" film strip above it. */

/* Films in the strip. Add a still to public/images and a line here to show another film. */
const NOW_SHOWING = [
  { src: '/images/oppenheimer.jpg', title: 'Oppenheimer', year: 2023, director: 'Christopher Nolan', alt: 'Oppenheimer at dusk in front of a stone building' },
  { src: '/images/babylon.jpg', title: 'Babylon', year: 2022, director: 'Damien Chazelle', alt: 'Nellie LaRoy in a red dress, lying on her back on a painted stage floor' },
  { src: '/images/do-the-right-thing.jpg', title: 'Do the Right Thing', year: 1989, director: 'Spike Lee', alt: 'A man sitting on a bed in a dark room glowing red and orange from the street light outside' },
  { src: '/images/in-the-mood-for-love.jpg', title: 'In the Mood for Love', year: 2000, director: 'Wong Kar-wai', alt: 'A man seen in a mirror and a woman on a red bed, lit by warm lamplight' },
  { src: '/images/get-out.jpg', title: 'Get Out', year: 2017, director: 'Jordan Peele', alt: 'Chris frozen in an extreme close-up, tears on his face' },
  { src: '/images/social-network.jpg', title: 'The Social Network', year: 2010, director: 'David Fincher', alt: 'A hand writing an equation on a window, faces blurred behind it' },
  { src: '/images/phantom-thread.jpg', title: 'Phantom Thread', year: 2017, director: 'Paul Thomas Anderson', alt: 'A couple embracing in an empty ballroom under a single spotlight' },
]

function FilmStrip() {
  return (
    <div className="filmstrip" role="region" aria-label="Now showing: films you can study in ReFrame">
      <p className="filmstrip__label"><span>●</span> Now showing</p>
      <div className="filmstrip__viewport">
        <div className="filmstrip__track">
          {/* the list is shown twice so the strip can loop seamlessly; the copy is hidden from screen readers */}
          {[0, 1].map((copy) =>
            NOW_SHOWING.map((film) => (
              <figure className="filmstrip__frame" key={`${copy}-${film.title}`} aria-hidden={copy === 1 ? true : undefined}>
                <img src={film.src} alt={copy === 0 ? `Still from ${film.title} (${film.year}): ${film.alt}` : ''} />
                <figcaption><em>{film.title}</em> {film.year} · {film.director}</figcaption>
              </figure>
            )),
          )}
        </div>
      </div>
    </div>
  )
}

export function CallToAction() {
  return (
    <>
  {/* =========================================================
           7. CALL TO ACTION
           ========================================================= */}
      <section className="section cta" id="download" aria-labelledby="cta-title">
        <FilmStrip />
        <div className="container cta__inner">
          <h2 className="cta__title" id="cta-title" data-split="">Start <em>reading</em> film <em>today.</em></h2>
          <p className="cta__sub" data-reveal="">Free to download. Every frame you study makes you a better filmmaker.</p>
          <div className="cta__actions" data-reveal="">
            {/* Replace href="#" with your App Store / Google Play links */}
            <a href="#" className="btn btn--primary btn--lg">Download ReFrame</a>
          </div>
        </div>
      </section>



    </>
  )
}
