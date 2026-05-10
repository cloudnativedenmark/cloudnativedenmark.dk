import React from "react"
import { Link } from "react-router-dom"
import SEOHead from "../components/seo-head"
import CNDShape from "../components/ui/cnd-shape"
import Button from "../components/ui/button"

const NotFoundPage: React.FC = () => {
  return (
    <>
      <SEOHead title="Page Not Found" />
      <main className="relative isolate flex min-h-[78vh] flex-col items-center justify-center overflow-hidden bg-cnd-bone px-6 py-16 text-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ top: 40, right: 60, opacity: 0.5 }}
        >
          <CNDShape size={140} fill="var(--color-cnd-coral)" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute hidden md:block"
          style={{ bottom: 50, left: 60, opacity: 0.5 }}
        >
          <CNDShape size={120} fill="var(--color-cnd-amber)" />
        </div>
        <div className="relative">
          <div
            className="eyebrow mb-3"
            style={{ color: "var(--color-cnd-red)", letterSpacing: "0.22em" }}
          >
            ERROR · STAGE NOT FOUND
          </div>
          <h1
            className="display text-cnd-midnight"
            style={{
              fontSize: "clamp(96px, 14vw, 200px)",
              letterSpacing: "-0.05em",
              lineHeight: 0.9,
            }}
          >
            404.
          </h1>
          <p
            className="mx-auto mt-6 max-w-md text-cnd-slate"
            style={{ fontSize: 18, lineHeight: 1.5 }}
          >
            That page doesn't exist or has been moved. Hop back to the main
            stage.
          </p>
          <div className="mt-8 flex justify-center">
            <Link to="/">
              <Button>Back to home →</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}

export default NotFoundPage
