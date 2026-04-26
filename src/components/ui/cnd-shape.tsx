import React from "react"

const CND_SHAPE_PATH =
  "M225.407 135.107L206.4 52.547a14.838 14.838 0 0 0-7.958-9.9l-76.935-36.73a14.825 14.825 0 0 0-12.771 0L31.808 42.669a14.838 14.838 0 0 0-7.961 9.895L4.873 135.129a14.668 14.668 0 0 0 1.995 11.185c.261.4.538.788.838 1.162l53.246 66.205a14.98 14.98 0 0 0 11.499 5.487l85.387-.02a14.986 14.986 0 0 0 11.5-5.48l53.227-66.211a14.72 14.72 0 0 0 2.842-12.347z"

const CND_SHAPE_VIEWBOX = "4.49 4.49 221.15 214.59"

interface CNDShapeProps {
  size?: number
  fill?: string
  stroke?: string
  strokeWidth?: number
  className?: string
  style?: React.CSSProperties
  children?: React.ReactNode
  preserveAspect?: boolean
}

const CNDShape: React.FC<CNDShapeProps> = ({
  size = 80,
  fill = "var(--color-cnd-electric)",
  stroke,
  strokeWidth = 3,
  className = "",
  style,
  children,
  preserveAspect = true,
}) => {
  const aspect = 214.59 / 221.15
  return (
    <div
      className={className}
      style={{
        width: size,
        height: size * aspect,
        aspectRatio: `${221.15} / ${214.59}`,
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...style,
      }}
    >
      <svg
        viewBox={CND_SHAPE_VIEWBOX}
        width="100%"
        height="100%"
        style={{ position: "absolute", inset: 0, display: "block" }}
        preserveAspectRatio={preserveAspect ? "xMidYMid meet" : "none"}
        aria-hidden="true"
      >
        <path
          d={CND_SHAPE_PATH}
          fill={fill}
          stroke={stroke}
          strokeWidth={stroke ? strokeWidth : 0}
        />
      </svg>
      {children && (
        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: size * 0.12,
          }}
        >
          {children}
        </div>
      )}
    </div>
  )
}

export { CND_SHAPE_PATH, CND_SHAPE_VIEWBOX }
export default CNDShape
