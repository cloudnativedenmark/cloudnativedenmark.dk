import React, { useState, useRef } from "react"
import { Link } from "react-router-dom"
import Section from "../ui/section"
import Button from "../ui/button"
import { siteConfig } from "../../config/site"

const venueImages = [
  {
    src: "/images/scandic-copenhagen/hotel-outside-2.jpg",
    alt: "Scandic Copenhagen exterior",
  },
  { src: "/images/scandic-copenhagen/auditorium.webp", alt: "Main auditorium" },
  { src: "/images/scandic-copenhagen/hall-1.webp", alt: "Conference hall" },
  { src: "/images/scandic-copenhagen/hall-2.webp", alt: "Exhibition area" },
  { src: "/images/scandic-copenhagen/restaurant.jpg", alt: "Restaurant" },
]

// Add last image at start and first image at end for seamless infinite scroll
const carouselImages = [
  venueImages[venueImages.length - 1],
  ...venueImages,
  venueImages[0],
]

const VenueSection: React.FC = () => {
  // Start at index 1 (first real image, since index 0 is the duplicate last)
  const [currentIndex, setCurrentIndex] = useState(1)
  const [dragOffset, setDragOffset] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)
  const isHorizontalSwipe = useRef<boolean | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  const goToPrevious = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev - 1)
  }

  const goToNext = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setCurrentIndex((prev) => prev + 1)
  }

  // Handle seamless loop
  const handleTransitionEnd = () => {
    // When at duplicate first image (end), jump to real first
    if (currentIndex === carouselImages.length - 1) {
      setIsTransitioning(false)
      // Double RAF to ensure transition is fully disabled before jump
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCurrentIndex(1)
        })
      })
      return
    }
    // When at duplicate last image (start), jump to real last
    if (currentIndex === 0) {
      setIsTransitioning(false)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCurrentIndex(venueImages.length)
        })
      })
      return
    }
    setIsTransitioning(false)
  }

  // Get the real image index for dot indicators (0-based, within venueImages)
  const getRealIndex = () => {
    if (currentIndex === 0) return venueImages.length - 1
    if (currentIndex === carouselImages.length - 1) return 0
    return currentIndex - 1
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
    touchStartY.current = e.touches[0].clientY
    isHorizontalSwipe.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const diffX = currentX - touchStartX.current
    const diffY = currentY - touchStartY.current

    // Determine swipe direction on first significant movement
    if (
      isHorizontalSwipe.current === null &&
      (Math.abs(diffX) > 10 || Math.abs(diffY) > 10)
    ) {
      isHorizontalSwipe.current = Math.abs(diffX) > Math.abs(diffY)
      if (isHorizontalSwipe.current) {
        setIsDragging(true)
      }
    }

    // Only handle horizontal swipes
    if (isHorizontalSwipe.current) {
      e.preventDefault()
      setDragOffset(diffX)
    }
  }

  const handleTouchEnd = () => {
    if (isHorizontalSwipe.current && touchStartX.current !== null) {
      const containerWidth = containerRef.current?.offsetWidth || 300
      const threshold = containerWidth * 0.2

      if (dragOffset < -threshold) {
        goToNext()
      } else if (dragOffset > threshold) {
        goToPrevious()
      }
    }

    setDragOffset(0)
    setIsDragging(false)
    touchStartX.current = null
    touchStartY.current = null
    isHorizontalSwipe.current = null
  }

  return (
    <Section className="bg-cnd-bone text-cnd-midnight">
      <div className="text-center">
        <div className="eyebrow mb-3" style={{ color: "var(--color-cnd-red)" }}>
          04 · VENUE
        </div>
        <h2
          className="display mb-12 text-cnd-midnight"
          style={{
            fontSize: "clamp(32px, 5vw, 56px)",
            letterSpacing: "-0.035em",
          }}
        >
          Where we land.
        </h2>
        {siteConfig.venueAnnouncementMode ? (
          <div className="flex flex-col items-center justify-center gap-8">
            <p className="text-3xl lg:text-3xl italic text-gray-900">
              To be announced. Stay tuned!{" "}
              <span className="not-italic">🔔</span>
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Photo carousel with venue info */}
            <div className="flex flex-col md:flex-row items-center gap-8 max-w-4xl mx-auto">
              {/* Image carousel */}
              <div className="relative w-full md:w-1/2 flex-shrink-0">
                {/* Previous button - desktop */}
                <button
                  onClick={goToPrevious}
                  className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Previous image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>

                {/* Image carousel with swipe */}
                <div
                  ref={containerRef}
                  className="relative rounded-2xl overflow-hidden h-72 md:h-80 touch-pan-y"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <div
                    className={`flex h-full ${
                      isDragging || !isTransitioning
                        ? ""
                        : "transition-transform duration-300 ease-out"
                    }`}
                    style={{
                      transform: `translateX(calc(-${currentIndex * (100 / carouselImages.length)}% + ${dragOffset}px))`,
                      width: `${carouselImages.length * 100}%`,
                    }}
                    onTransitionEnd={handleTransitionEnd}
                  >
                    {carouselImages.map((image, index) => (
                      <div
                        key={index}
                        className="h-full flex-shrink-0"
                        style={{ width: `${100 / carouselImages.length}%` }}
                      >
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          draggable={false}
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next button - desktop */}
                <button
                  onClick={goToNext}
                  className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 bg-white shadow-lg rounded-full p-2 hover:bg-gray-100 transition-colors"
                  aria-label="Next image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 text-gray-700"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>

                {/* Dot indicators */}
                <div className="flex justify-center gap-2 mt-3">
                  {venueImages.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index + 1)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === getRealIndex() ? "bg-cnd-red" : "bg-cnd-fog"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Venue info */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <img
                  src="/images/scandic-logo.png"
                  alt="Scandic"
                  className="h-10 md:h-12 mb-3 object-contain"
                  loading="lazy"
                />
                <p className="text-xl md:text-2xl font-semibold text-gray-900">
                  Scandic Copenhagen
                </p>
                <p className="text-gray-600 mt-1">
                  Vester Søgade 6, 1602 København
                </p>
              </div>
            </div>

            {/* CTA */}
            <div>
              <Link to="/venue">
                <Button variant="primary">View Venue Details</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </Section>
  )
}

export default VenueSection
