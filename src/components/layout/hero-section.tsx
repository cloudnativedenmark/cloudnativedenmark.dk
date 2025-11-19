import React from "react"
import { Link } from "react-router-dom"
import Section from "../ui/section"
import Button from "../ui/button"

interface HeroSectionProps {
  logo?: {
    src: string
    alt: string
    width?: number
    height?: number | string
  }
  title: string | React.ReactNode
  subtitle?: string
  description?: string
  primaryAction?: {
    text: string
    href: string
    isExternal?: boolean
  }
  secondaryAction?: {
    text: string
    href: string
    isExternal?: boolean
  }
  backgroundElement?: React.ReactNode
}

const HeroSection: React.FC<HeroSectionProps> = ({
  logo,
  title,
  subtitle,
  description,
  primaryAction,
  secondaryAction,
  backgroundElement,
}) => {
  return (
    <Section className="bg-white relative overflow-hidden p-0!">
      <div className="relative z-10 pt-16 pb-16">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {logo && (
            <div className="flex-1 lg:order-1 flex justify-center">
              <img
                src={logo.src}
                width={logo.width || 300}
                height={logo.height || "auto"}
                loading="eager"
                alt={logo.alt}
                className="mx-auto lg:mx-0"
              />
            </div>
          )}
          <div className="flex-1 lg:order-2 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl tracking-tight text-gray-900 mb-4">
              {title}
            </h1>
            {subtitle && (
              <p className="text-xl lg:text-2xl font-medium text-gray-800 mb-8">
                {subtitle}
              </p>
            )}
            {description && (
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                {description}
              </p>
            )}
            {(primaryAction || secondaryAction) && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                {primaryAction &&
                  (primaryAction.isExternal ? (
                    <a
                      href={primaryAction.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button>{primaryAction.text}</Button>
                    </a>
                  ) : (
                    <Link to={primaryAction.href}>
                      <Button>{primaryAction.text}</Button>
                    </Link>
                  ))}
                {secondaryAction &&
                  (secondaryAction.isExternal ? (
                    <a
                      href={secondaryAction.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary">
                        {secondaryAction.text}
                      </Button>
                    </a>
                  ) : (
                    <Link to={secondaryAction.href}>
                      <Button variant="secondary">
                        {secondaryAction.text}
                      </Button>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {backgroundElement && (
        <div className="opacity-100 min-w-xl">{backgroundElement}</div>
      )}
    </Section>
  )
}

export default HeroSection
