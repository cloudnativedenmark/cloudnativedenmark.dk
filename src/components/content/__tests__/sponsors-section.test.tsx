import React from "react"
import { render, screen } from "@testing-library/react"
import SponsorsSection from "../sponsors-section"

const createMockSponsor = (title: string, overrides = {}) => ({
  title,
  url: `https://${title.toLowerCase().replace(/\s/g, "")}.com`,
  logo: {
    publicURL: `/assets/${title.toLowerCase().replace(/\s/g, "-")}.svg`,
  },
  ...overrides,
})

describe("SponsorsSection", () => {
  const defaultProps = {
    platinum: [],
    gold: [],
    bronze: [],
    community: [],
    partners: [],
  }

  describe("rendering", () => {
    it("should render the Sponsors heading", () => {
      render(<SponsorsSection {...defaultProps} />)

      expect(
        screen.getByRole("heading", { name: "Sponsors" })
      ).toBeInTheDocument()
    })

    it("should render the sponsor contact email", () => {
      render(<SponsorsSection {...defaultProps} />)

      const emailLink = screen.getByRole("link", {
        name: "sponsor@cloudnativedenmark.dk",
      })
      expect(emailLink).toBeInTheDocument()
      expect(emailLink).toHaveAttribute(
        "href",
        "mailto:sponsor@cloudnativedenmark.dk"
      )
    })

    it("should render the Sponsor Prospectus button", () => {
      render(<SponsorsSection {...defaultProps} />)

      expect(
        screen.getByRole("button", { name: "Sponsor Prospectus" })
      ).toBeInTheDocument()
    })

    it("should link to the Canva prospectus", () => {
      render(<SponsorsSection {...defaultProps} />)

      const prospectusLink = screen.getByRole("link", {
        name: "Sponsor Prospectus",
      })
      expect(prospectusLink).toHaveAttribute(
        "href",
        "https://www.canva.com/design/DAG18lTHcrM/RZGm8CHGviE7ZRUBsupWOA/edit"
      )
    })
  })

  describe("sponsor tier rendering", () => {
    it("should render platinum sponsors when provided", () => {
      const props = {
        ...defaultProps,
        platinum: [createMockSponsor("Platinum Sponsor")],
      }

      render(<SponsorsSection {...props} />)

      expect(screen.getByText("Platinum Sponsors")).toBeInTheDocument()
      expect(screen.getByAltText("Platinum Sponsor")).toBeInTheDocument()
    })

    it("should render gold sponsors when provided", () => {
      const props = {
        ...defaultProps,
        gold: [createMockSponsor("Gold Sponsor")],
      }

      render(<SponsorsSection {...props} />)

      expect(screen.getByText("Gold Sponsors")).toBeInTheDocument()
      expect(screen.getByAltText("Gold Sponsor")).toBeInTheDocument()
    })

    it("should render bronze sponsors when provided", () => {
      const props = {
        ...defaultProps,
        bronze: [createMockSponsor("Bronze Sponsor")],
      }

      render(<SponsorsSection {...props} />)

      expect(screen.getByText("Bronze Sponsors")).toBeInTheDocument()
      expect(screen.getByAltText("Bronze Sponsor")).toBeInTheDocument()
    })

    it("should render community sponsors when provided", () => {
      const props = {
        ...defaultProps,
        community: [createMockSponsor("Online City", { scale: "120%" })],
      }

      render(<SponsorsSection {...props} />)

      expect(screen.getByText("Community Sponsors")).toBeInTheDocument()
      expect(screen.getByAltText("Online City")).toBeInTheDocument()
    })

    it("should render partners when provided", () => {
      const props = {
        ...defaultProps,
        partners: [createMockSponsor("CNCF")],
      }

      render(<SponsorsSection {...props} />)

      expect(screen.getByText("Partners & Media")).toBeInTheDocument()
      expect(screen.getByAltText("CNCF")).toBeInTheDocument()
    })

    it("should not render tier sections when empty", () => {
      render(<SponsorsSection {...defaultProps} />)

      expect(screen.queryByText("Platinum Sponsors")).not.toBeInTheDocument()
      expect(screen.queryByText("Gold Sponsors")).not.toBeInTheDocument()
      expect(screen.queryByText("Bronze Sponsors")).not.toBeInTheDocument()
      expect(screen.queryByText("Community Sponsors")).not.toBeInTheDocument()
      expect(screen.queryByText("Partners & Media")).not.toBeInTheDocument()
    })
  })

  describe("multiple sponsors per tier", () => {
    it("should render all sponsors in a tier", () => {
      const props = {
        ...defaultProps,
        community: [
          createMockSponsor("Online City"),
          createMockSponsor("Another Sponsor"),
          createMockSponsor("Third Sponsor"),
        ],
      }

      render(<SponsorsSection {...props} />)

      expect(screen.getByAltText("Online City")).toBeInTheDocument()
      expect(screen.getByAltText("Another Sponsor")).toBeInTheDocument()
      expect(screen.getByAltText("Third Sponsor")).toBeInTheDocument()
    })
  })

  describe("multiple tiers with sponsors", () => {
    it("should render multiple tier sections simultaneously", () => {
      const props = {
        platinum: [createMockSponsor("Platinum Co")],
        gold: [createMockSponsor("Gold Co")],
        bronze: [createMockSponsor("Bronze Co")],
        community: [createMockSponsor("Community Co")],
        partners: [createMockSponsor("Partner Co")],
      }

      render(<SponsorsSection {...props} />)

      expect(screen.getByText("Platinum Sponsors")).toBeInTheDocument()
      expect(screen.getByText("Gold Sponsors")).toBeInTheDocument()
      expect(screen.getByText("Bronze Sponsors")).toBeInTheDocument()
      expect(screen.getByText("Community Sponsors")).toBeInTheDocument()
      expect(screen.getByText("Partners & Media")).toBeInTheDocument()
    })
  })

  describe("accessibility", () => {
    it("should have accessible sponsor heading with id", () => {
      render(<SponsorsSection {...defaultProps} />)

      const heading = screen.getByRole("heading", { name: "Sponsors" })
      expect(heading).toHaveAttribute("id", "sponsors")
    })

    it("should have alt text for all sponsor images", () => {
      const props = {
        ...defaultProps,
        community: [createMockSponsor("Accessible Sponsor")],
      }

      render(<SponsorsSection {...props} />)

      expect(screen.getByAltText("Accessible Sponsor")).toBeInTheDocument()
    })
  })
})
