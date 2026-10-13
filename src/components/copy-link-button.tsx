import React, { useState } from "react"
import Button from "./ui/button"

const CopyLinkButton: React.FC<{ path: string; label: string }> = ({
  path,
  label,
}) => {
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
    <Button onClick={copy} variant="primary">
      {status}
    </Button>
  )
}

export default CopyLinkButton
