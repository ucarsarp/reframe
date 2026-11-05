/* Logos: the ReFrame and Nolan marks as inline SVG, so they take the text colour (currentColor).
   The same drawings live in public/brand/ as standalone files (favicon, downloads). */

// Nolan: two mirrored slabs make the N; it reads the same upside down (a Tenet palindrome).
// The thin red line is the eye-line running through the frame.
export function NolanMark({ className }: { className?: string }) {
  const slab = 'M24 76V24a4 4 0 0 1 4-4c10.5 0 19 12 19 28v28a4 4 0 0 1-4 4H28a4 4 0 0 1-4-4Z'
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path fill="currentColor" d={slab} />
      <path fill="currentColor" d={slab} transform="rotate(180 50 50)" />
      <path d="M8 50h84" stroke="var(--accent-red)" strokeWidth="1.4" />
    </svg>
  )
}

// ReFrame: an R whose bowl holds a lens, inside viewfinder crop marks, with a red REC dot.
export function ReFrameMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="none" aria-hidden="true">
      <path d="M10 26V10h16M74 10h16v16M90 74v16H74M26 90H10V74" stroke="currentColor" strokeWidth="3" />
      <path fill="currentColor" fillRule="evenodd" d="M30 26h22a15 15 0 0 1 0 30h-1l17 20H56L41 57.5V76H30V26Zm22 7a8 8 0 1 0 0 16 8 8 0 0 0 0-16Z" />
      <circle cx="52" cy="41" r="3" fill="currentColor" />
      <circle className="mark__rec" cx="80" cy="20" r="3.4" fill="var(--accent-red)" />
    </svg>
  )
}
