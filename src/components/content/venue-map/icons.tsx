import React from "react"

// Stroke icons on a 24x24 grid, from Lucide (ISC licence)
const glyphs = {
  coffee: (
    <>
      <path d="M10 2v2" />
      <path d="M14 2v2" />
      <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" />
      <path d="M6 2v2" />
    </>
  ),
  water: (
    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
  ),
  lunch: (
    <>
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </>
  ),
  registration: (
    <>
      <path d="M12 17v-6" />
      <path d="M12 7h.01" />
    </>
  ),
  exit: (
    <>
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </>
  ),
  entrance: (
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>
  ),
}

export type GlyphName = keyof typeof glyphs

interface GlyphProps {
  name: GlyphName
  /** Centre of the glyph in the parent's coordinates */
  x: number
  y: number
  size: number
  color?: string
  /** Applied around the centre before drawing, e.g. "rotate(90 x y)" */
  transform?: string
}

/** A glyph placed inside an SVG */
export const Glyph: React.FC<GlyphProps> = ({
  name,
  x,
  y,
  size,
  color = "#ffffff",
  transform,
}) => (
  <g
    transform={`${transform ?? ""} translate(${x - size / 2} ${y - size / 2}) scale(${size / 24})`}
    fill="none"
    stroke={color}
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {glyphs[name]}
  </g>
)

/** A glyph as a standalone inline icon, for legends */
export const GlyphIcon: React.FC<{ name: GlyphName; className?: string }> = ({
  name,
  className,
}) => (
  <svg
    viewBox="0 0 24 24"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth={2.4}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {glyphs[name]}
  </svg>
)
