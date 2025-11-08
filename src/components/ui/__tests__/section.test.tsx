import React from "react"
import { render, screen } from "@testing-library/react"
import Section from "../section"

describe("Section", () => {
  describe("rendering", () => {
    it("should render children correctly", () => {
      render(
        <Section>
          <p>Test content</p>
        </Section>
      )
      expect(screen.getByText("Test content")).toBeInTheDocument()
    })

    it("should render as section element", () => {
      render(<Section>Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toBeInTheDocument()
    })

    it("should apply custom id", () => {
      render(<Section id="custom-section">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveAttribute("id", "custom-section")
    })

    it("should apply custom className", () => {
      render(<Section className="custom-class">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("custom-class")
    })
  })

  describe("variants", () => {
    it("should apply default variant classes", () => {
      render(<Section>Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("bg-white")
    })

    it("should apply dark variant classes", () => {
      render(<Section variant="dark">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("bg-background-dark")
    })

    it("should apply light variant classes", () => {
      render(<Section variant="light">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("bg-gray-50")
    })

    it("should apply gray variant classes", () => {
      render(<Section variant="gray">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("bg-gray-100")
    })
  })

  describe("spacing", () => {
    it("should apply default padding classes", () => {
      render(<Section>Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("py-16", "px-12")
    })

    it("should apply custom paddingY", () => {
      render(<Section paddingY="small">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("py-8")
    })

    it("should apply custom paddingX", () => {
      render(<Section paddingX="none">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("px-0")
    })

    it("should apply none spacing correctly", () => {
      render(
        <Section paddingY="none" paddingX="none">
          Content
        </Section>
      )
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("py-0", "px-0")
    })

    it("should apply xlarge spacing correctly", () => {
      render(
        <Section paddingY="xlarge" paddingX="xlarge">
          Content
        </Section>
      )
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("py-20", "px-20")
    })
  })

  describe("spacing values", () => {
    it("should apply small spacing", () => {
      render(<Section paddingY="small">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("py-8")
    })

    it("should apply medium spacing", () => {
      render(<Section paddingY="medium">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("py-12")
    })

    it("should apply large spacing", () => {
      render(<Section paddingY="large">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass("py-16")
    })
  })

  describe("combined props", () => {
    it("should combine all props correctly", () => {
      render(
        <Section
          variant="dark"
          paddingY="small"
          paddingX="medium"
          className="custom-class"
          id="test-section"
        >
          Content
        </Section>
      )

      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass(
        "bg-background-dark", // variant
        "py-8", // paddingY small
        "px-12", // paddingX medium
        "custom-class" // custom className
      )
      expect(section).toHaveAttribute("id", "test-section")
    })

    it("should handle custom className alongside generated classes", () => {
      render(
        <Section variant="gray" className="border-t custom-padding">
          Content
        </Section>
      )

      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveClass(
        "bg-gray-100", // variant class
        "py-16", // default paddingY
        "px-12", // default paddingX
        "border-t", // custom class
        "custom-padding" // custom class
      )
    })
  })

  describe("accessibility", () => {
    it("should be a semantic section element", () => {
      render(<Section>Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section?.tagName).toBe("SECTION")
    })

    it("should support custom id for accessibility", () => {
      render(<Section id="main-content">Content</Section>)
      const section = screen.getByText("Content").closest("section")
      expect(section).toHaveAttribute("id", "main-content")
    })
  })
})
