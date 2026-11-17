/* Logos: the ReFrame main logo and Nolan marks as inline SVG, so they take the text colour
   (currentColor). The shapes come from logo-paths.ts, generated from the "logo finals" designs. */
import { NOLAN, TITLE } from './logo-paths'

// ReFrame main logo (R7): "Re" over "Frame" between widescreen rules, a red timecode bar across the
// middle and a red record dot. `compact` drops the tiny "2.39 : 1" and "REC" labels for small spots like the header.
export function ReFrameTitle({ className, compact = false }: { className?: string; compact?: boolean }) {
  const { rules, word, clipHeight, pill, timecode, dot, ratio, rec } = TITLE
  return (
    <svg className={className} viewBox={compact ? '0 0 300 216' : '0 0 300 250'} fill="none" aria-hidden="true">
      <defs>
        <clipPath id="reframe-crop"><rect x="0" y="0" width="300" height={clipHeight} /></clipPath>
      </defs>
      <path d={rules} stroke="currentColor" strokeOpacity=".4" strokeWidth="1.6" />
      <path d={word} fill="currentColor" clipPath="url(#reframe-crop)" />
      <rect {...pill} fill="var(--accent-red)" stroke="var(--bg)" strokeWidth="5" />
      <path d={timecode} fill="#f5f5f3" />
      <circle className="mark__rec" {...dot} fill="var(--accent-red)" />
      {!compact && <path d={ratio + rec} fill="currentColor" fillOpacity=".55" />}
    </svg>
  )
}

// Nolan's lens: red barrel, darker inner ring, dark aperture and a glint of light
function Lens({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  return (
    <>
      <circle cx={cx} cy={cy} r={r} fill="var(--accent-red)" />
      <circle cx={cx} cy={cy} r={r * 0.7} stroke="#0a0a0a" strokeOpacity=".28" strokeWidth={r * 0.06} />
      <circle cx={cx} cy={cy} r={r * 0.42} fill="#0a0a0a" />
      <circle cx={cx - r * 0.15} cy={cy - r * 0.15} r={r * 0.11} fill="#f5f5f3" />
    </>
  )
}

// Nolan (The eye): "nolan" with the o as the red lens
export function NolanWordmark({ className }: { className?: string }) {
  const { viewBox, letters, lens } = NOLAN
  return (
    <svg className={className} viewBox={viewBox.join(' ')} fill="none" aria-hidden="true">
      <path d={letters} fill="currentColor" />
      <Lens {...lens} />
    </svg>
  )
}

// Nolan's avatar: the lens on its own
export function NolanMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <Lens cx={50} cy={50} r={50} />
    </svg>
  )
}
