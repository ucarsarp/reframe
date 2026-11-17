/* Two rows of giant italic words that slide in opposite directions as you scroll (decorative).
   Sits between Meet Nolan and Mission. */
export function ScrollBand() {
  return (
    <>
      {/* Two rows of giant italic words that slide in opposite directions as you scroll (decorative) */}
      <div className="scroll-band" aria-hidden="true">
        <div className="scroll-band__row" data-band="1">Light <i>✦</i> Shadow <i>✦</i> Framing <i>✦</i> Colour <i>✦</i> Light <i>✦</i> Shadow <i>✦</i> Framing <i>✦</i> Colour <i>✦</i></div>
        <div className="scroll-band__row scroll-band__row--outline" data-band="-1">Intent <i>✦</i> Blocking <i>✦</i> Rhythm <i>✦</i> Mood <i>✦</i> Intent <i>✦</i> Blocking <i>✦</i> Rhythm <i>✦</i> Mood <i>✦</i></div>
      </div>


    </>
  )
}
