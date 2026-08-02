import React from "react"

const Star: React.FC<{ filled: boolean; size: number }> = ({
  filled,
  size,
}) => (
  <svg
    viewBox="0 0 20 20"
    width={size}
    height={size}
    fill={filled ? "var(--color-cnd-amber)" : "none"}
    stroke={filled ? "var(--color-cnd-amber)" : "var(--color-cnd-ash)"}
    strokeWidth={1.5}
  >
    <path
      d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6-4.5-4.2 6.1-.7z"
      strokeLinejoin="round"
    />
  </svg>
)

export const StarRatingInput: React.FC<{
  value: number
  onChange: (value: number) => void
}> = ({ value, onChange }) => (
  <div className="flex gap-2" role="radiogroup" aria-label="Rating">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        role="radio"
        aria-checked={value === n}
        aria-label={`${n} star${n > 1 ? "s" : ""}`}
        onClick={() => onChange(n)}
        className="p-1"
      >
        <Star filled={n <= value} size={32} />
      </button>
    ))}
  </div>
)

export const StarRatingDisplay: React.FC<{ value: number; size?: number }> = ({
  value,
  size = 16,
}) => (
  <div className="flex gap-0.5" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <Star key={n} filled={n <= value} size={size} />
    ))}
  </div>
)
