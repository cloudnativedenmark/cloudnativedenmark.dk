import React, { useId } from "react"
import { CND_SHAPE_PATH } from "./cnd-shape"

interface CNDPortraitProps {
  src: string
  alt: string
  /** Pixel size of the longer edge */
  size?: number
  /** Optional fill behind the image, shown if image fails to load */
  fallbackFill?: string
  /** Outline ring color drawn behind the photo */
  ringColor?: string
  /** Outline ring offset in px (the ring shape extends beyond the photo) */
  ringOffset?: number
  className?: string
  style?: React.CSSProperties
  loading?: "eager" | "lazy"
}

const SHAPE_VIEWBOX = "4.49 4.49 221.15 214.59"
const ASPECT = 214.59 / 221.15

const CNDPortrait: React.FC<CNDPortraitProps> = ({
  src,
  alt,
  size = 220,
  fallbackFill = "var(--color-cnd-harbor)",
  ringColor,
  ringOffset = 8,
  className = "",
  style,
  loading = "lazy",
}) => {
  const reactId = useId().replace(/[:]/g, "-")
  const clipId = `cnd-portrait-clip-${reactId}`

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size * ASPECT,
        aspectRatio: `${221.15} / ${214.59}`,
        ...style,
      }}
    >
      {ringColor && (
        <svg
          viewBox={SHAPE_VIEWBOX}
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: "absolute",
            inset: -ringOffset,
            width: `calc(100% + ${ringOffset * 2}px)`,
            height: `calc(100% + ${ringOffset * 2}px)`,
          }}
          aria-hidden="true"
        >
          <path d={CND_SHAPE_PATH} fill={ringColor} />
        </svg>
      )}
      <svg
        viewBox={SHAPE_VIEWBOX}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ position: "relative", display: "block" }}
        role="img"
        aria-label={alt}
      >
        <defs>
          <clipPath id={clipId}>
            <path d={CND_SHAPE_PATH} />
          </clipPath>
        </defs>
        {/* Fallback fill — visible if the image has not yet loaded */}
        <path d={CND_SHAPE_PATH} fill={fallbackFill} />
        <image
          href={src}
          x={SHAPE_VIEWBOX.split(" ")[0]}
          y={SHAPE_VIEWBOX.split(" ")[1]}
          width={SHAPE_VIEWBOX.split(" ")[2]}
          height={SHAPE_VIEWBOX.split(" ")[3]}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
          style={{ pointerEvents: "none" }}
          // @ts-expect-error - SVG image accepts loading attribute on most browsers
          loading={loading}
        />
      </svg>
    </div>
  )
}

export default CNDPortrait
