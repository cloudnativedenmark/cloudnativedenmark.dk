import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { siteConfig } from "../config/site"

const ArchiveRedirect = () => {
  const { pathname, search, hash } = useLocation()
  const target = `${siteConfig.previousEditionUrl}${pathname}${search}${hash}`

  useEffect(() => {
    window.location.replace(target)
  }, [target])

  return (
    <p role="status" className="p-12 text-center">
      Moved to <a href={target}>{target}</a>
    </p>
  )
}

export default ArchiveRedirect
