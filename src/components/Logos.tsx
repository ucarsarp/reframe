/* Logos: the final ReFrame title and Nolan marks as inline SVG, so they take the text colour
   (currentColor). The shapes come from logo-paths.ts, generated from the "logo finals" designs. */
import { NOLAN, TITLE } from './logo-paths'

// ReFrame title (Letterbox): the whole word between two widescreen rules, red record dot top right
export function ReFrameTitle({ className }: { className?: string }) {
  const { viewBox, rules, word, dot } = TITLE
  return (
    <svg className={className} viewBox={viewBox.join(' ')} fill="none" aria-hidden="true">
      <path d={rules} stroke="currentColor" strokeOpacity=".4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <path d={word} fill="currentColor" />
      <circle className="mark__rec" cx={dot.cx} cy={dot.cy} r={dot.r} fill="var(--accent-red)" />
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
