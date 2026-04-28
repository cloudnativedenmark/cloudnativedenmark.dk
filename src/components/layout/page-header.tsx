import React from "react"
import Section from "../ui/section"
import CNDShape from "../ui/cnd-shape"

interface PageHeaderProps {
  title: string
  description?: string
  variant?: "default" | "dark"
  size?: "medium" | "large"
  eyebrow?: string
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  variant = "dark",
  size = "large",
  eyebrow,
}) => {
  const isDark = variant === "dark"

  return (
    <Section
      className={`relative overflow-hidden ${
        isDark
          ? "bg-cnd-midnight text-white hex-bg"
          : "bg-cnd-bone text-cnd-midnight"
      } pt-20 pb-12 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20`}
    >
      {/* Top red rule echoing the homepage hero */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-0 right-0 h-[5px] bg-cnd-red"
      />

      {/* Decorative shapes — kept fully within section so they're not clipped */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden md:block"
        style={{ top: 30, right: 40, opacity: isDark ? 0.14 : 0.45 }}
      >
        <CNDShape size={140} fill="var(--color-cnd-coral)" />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute hidden md:block"
        style={{ bottom: 30, left: 40, opacity: isDark ? 0.12 : 0.4 }}
      >
        <CNDShape
          size={110}
          fill={isDark ? "var(--color-cnd-electric)" : "var(--color-cnd-amber)"}
        />
      </div>

      <div className="relative text-center">
        {eyebrow && (
          <div
            className="eyebrow mb-4"
            style={{
              color: isDark ? "var(--color-cnd-coral)" : "var(--color-cnd-red)",
              letterSpacing: "0.22em",
            }}
          >
            {eyebrow}
          </div>
        )}
        <h1
          className="display"
          style={{
            fontSize:
              size === "large"
                ? "clamp(48px, 7vw, 88px)"
                : "clamp(36px, 5vw, 60px)",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`mx-auto mt-8 max-w-3xl ${
              isDark ? "text-cnd-fog" : "text-cnd-slate"
            }`}
            style={{
              fontSize: size === "large" ? 20 : 17,
              lineHeight: 1.55,
              fontWeight: 500,
            }}
          >
            {description}
          </p>
        )}
      </div>
    </Section>
  )
}

export default PageHeader
