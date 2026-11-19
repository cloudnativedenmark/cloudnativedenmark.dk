import React, { useState } from "react"
import Button from "./ui/button"

const CopyLinkButton: React.FC<{
  path: string
  label: string
  variant?: React.ComponentProps<typeof Button>["variant"]
  className?: string
}> = ({ path, label, variant = "primary", className }) => {
  const [status, setStatus] = useState(label)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(path, window.location.origin).href
      )
      setStatus("Link copied")
    } catch {
      setStatus("Could not copy link")
    }
  }

  return (
    <Button onClick={copy} variant={variant} className={className}>
      {status}
    </Button>
  )
}

export default CopyLinkButton
