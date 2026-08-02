import { useCallback, useEffect, useState } from "react"
import type { ShoutMessage } from "./types"
import { getItem, setItem, StorageKeys } from "./storage"
import { apiRequest, isApiConfigured, adminHeaders } from "./api-client"

export function useShout() {
  const [messages, setMessages] = useState<ShoutMessage[]>(() =>
    getItem<ShoutMessage[]>(StorageKeys.shoutCache, [])
  )
  const connected = isApiConfigured()

  const refresh = useCallback(async () => {
    const data = await apiRequest<ShoutMessage[]>("/shout")
    if (data) {
      setMessages(data)
      setItem(StorageKeys.shoutCache, data)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const send = useCallback(
    async (title: string, body: string) => {
      const message: ShoutMessage = {
        id: crypto.randomUUID(),
        title,
        body,
        createdAt: new Date().toISOString(),
      }
      if (connected) {
        await apiRequest("/shout", {
          method: "POST",
          headers: adminHeaders(),
          body: JSON.stringify(message),
        })
        await refresh()
      } else {
        // No backend yet — keep it visible locally so the compose flow is
        // still demoable, but it won't reach anyone else's device.
        setMessages((prev) => {
          const next = [message, ...prev]
          setItem(StorageKeys.shoutCache, next)
          return next
        })
      }
    },
    [connected, refresh]
  )

  return { messages, send, connected }
}
