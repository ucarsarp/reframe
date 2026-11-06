/* Overlays: converted from the original index.html. Edit the text and markup here. */
export function Overlays() {
  return (
    <>
  <a className="skip-link" href="#main">Skip to content</a>

    {/* Inverting cursor (only enabled on mouse devices without reduced motion) */}
    <div className="cursor" aria-hidden="true"></div>
    {/* Camera REC light that trails the cursor around the page */}
    <div className="cursor-rec" aria-hidden="true"><i></i>REC</div>

    {/* Film grain + vignette over the whole page (decorative) */}
    <div className="grain" aria-hidden="true"></div>

    {/* Scroll HUD: a camera-style timecode that runs as you scroll, the current scene,
         and a thin progress line along the bottom edge */}
    <div className="hud" aria-hidden="true">
      <span className="hud__rec"><i></i>REC</span>
      <span className="hud__tc" id="hud-tc">00:00:00:00</span>
      <span className="hud__scene" id="hud-scene">Scene 00 / Opening</span>
    </div>
    <div className="scroll-progress" aria-hidden="true"><span id="scroll-progress"></span></div>


    </>
  )
}
