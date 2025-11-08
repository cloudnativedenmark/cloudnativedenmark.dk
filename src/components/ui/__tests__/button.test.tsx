import React from "react"
import { render, screen, fireEvent } from "@testing-library/react"
import Button from "../button"

describe("Button", () => {
  describe("rendering", () => {
    it("should render with default props", () => {
      render(<Button>Click me</Button>)
      const button = screen.getByRole("button", { name: /click me/i })
      expect(button).toBeInTheDocument()
    })

    it("should render children correctly", () => {
      render(<Button>Test Button</Button>)
      expect(screen.getByText("Test Button")).toBeInTheDocument()
    })

    it("should render with custom className", () => {
      render(<Button className="custom-class">Button</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("custom-class")
    })
  })

  describe("variants", () => {
    it("should apply primary variant classes by default", () => {
      render(<Button>Primary</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("bg-background")
      expect(button).toHaveClass("text-white")
    })

    it("should apply secondary variant classes", () => {
      render(<Button variant="secondary">Secondary</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("border-2")
      expect(button).toHaveClass("border-background")
      expect(button).toHaveClass("text-background")
    })

    it("should apply ghost variant classes", () => {
      render(<Button variant="ghost">Ghost</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("text-background")
      expect(button).toHaveClass("hover:bg-background")
    })

    it("should apply disabled variant classes", () => {
      render(<Button variant="disabled">Disabled</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("bg-gray-200")
      expect(button).toHaveClass("text-gray-500")
      expect(button).toHaveClass("cursor-not-allowed")
    })
  })

  describe("sizes", () => {
    it("should apply medium size classes by default", () => {
      render(<Button>Medium</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("px-6")
      expect(button).toHaveClass("py-3")
    })

    it("should apply small size classes", () => {
      render(<Button size="small">Small</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("px-4")
      expect(button).toHaveClass("py-2")
      expect(button).toHaveClass("text-sm")
    })

    it("should apply large size classes", () => {
      render(<Button size="large">Large</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("px-8")
      expect(button).toHaveClass("py-3")
      expect(button).toHaveClass("text-lg")
    })
  })

  describe("disabled state", () => {
    it("should be disabled when disabled prop is true", () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole("button")
      expect(button).toBeDisabled()
    })

    it("should not be disabled when disabled prop is false", () => {
      render(<Button disabled={false}>Enabled Button</Button>)
      const button = screen.getByRole("button")
      expect(button).not.toBeDisabled()
    })

    it("should apply disabled styles when disabled", () => {
      render(<Button disabled>Disabled Button</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveClass("bg-gray-200")
      expect(button).toHaveClass("text-gray-500")
      expect(button).toHaveClass("cursor-not-allowed")
    })
  })

  describe("click handling", () => {
    it("should call onClick when clicked", () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Clickable</Button>)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it("should not call onClick when disabled", () => {
      const handleClick = jest.fn()
      render(
        <Button onClick={handleClick} disabled>
          Disabled
        </Button>
      )

      const button = screen.getByRole("button")
      fireEvent.click(button)

      expect(handleClick).not.toHaveBeenCalled()
    })

    it("should pass event to onClick handler", () => {
      const handleClick = jest.fn()
      render(<Button onClick={handleClick}>Button</Button>)

      const button = screen.getByRole("button")
      fireEvent.click(button)

      expect(handleClick).toHaveBeenCalledWith(expect.any(Object))
    })
  })

  describe("accessibility", () => {
    it("should have correct role", () => {
      render(<Button>Accessible Button</Button>)
      const button = screen.getByRole("button")
      expect(button).toBeInTheDocument()
    })

    it("should support custom aria-label", () => {
      render(<Button aria-label="Custom label">Button</Button>)
      const button = screen.getByLabelText("Custom label")
      expect(button).toBeInTheDocument()
    })

    it("should support type attribute", () => {
      render(<Button type="submit">Submit</Button>)
      const button = screen.getByRole("button")
      expect(button).toHaveAttribute("type", "submit")
    })

    it("should be focusable when not disabled", () => {
      render(<Button>Focusable</Button>)
      const button = screen.getByRole("button")
      button.focus()
      expect(button).toHaveFocus()
    })
  })

  describe("style combinations", () => {
    it("should combine variant and size classes correctly", () => {
      render(
        <Button variant="secondary" size="large">
          Large Secondary
        </Button>
      )
      const button = screen.getByRole("button")

      // Size classes
      expect(button).toHaveClass("px-8", "py-3", "text-lg")
      // Variant classes
      expect(button).toHaveClass(
        "border-2",
        "border-background",
        "text-background"
      )
    })

    it("should override disabled styles when variant is disabled", () => {
      render(
        <Button variant="disabled" disabled={false}>
          Force Disabled Style
        </Button>
      )
      const button = screen.getByRole("button")
      expect(button).toHaveClass(
        "bg-gray-200",
        "text-gray-500",
        "cursor-not-allowed"
      )
      expect(button).not.toBeDisabled() // Not actually disabled
    })
  })
})
