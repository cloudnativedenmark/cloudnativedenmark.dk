import { useCallback, useState } from "react"
import { getItem, setItem, StorageKeys } from "./storage"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() =>
    getItem<string[]>(StorageKeys.favorites, [])
  )

  const toggleFavorite = useCallback((sessionId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId]
      setItem(StorageKeys.favorites, next)
      return next
    })
  }, [])

  const isFavorite = useCallback(
    (sessionId: string) => favorites.includes(sessionId),
    [favorites]
  )

  return { favorites, toggleFavorite, isFavorite }
}
