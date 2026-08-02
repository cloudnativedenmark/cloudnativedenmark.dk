import { useCallback, useState } from "react"
import { getItem, setItem, StorageKeys } from "./storage"
import { apiRequest } from "./api-client"

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/")
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export function usePushSubscription() {
  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    typeof Notification !== "undefined"

  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? Notification.permission : "denied"
  )
  const [subscribed, setSubscribed] = useState(() =>
    getItem<boolean>(StorageKeys.pushSubscribed, false)
  )

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!supported) return false

    const result = await Notification.requestPermission()
    setPermission(result)
    if (result !== "granted") return false

    const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
    if (!vapidKey) return false // backend not deployed yet — nothing to subscribe to

    const registration = await navigator.serviceWorker.ready
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidKey) as BufferSource,
    })
    await apiRequest("/push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription),
    })
    setItem(StorageKeys.pushSubscribed, true)
    setSubscribed(true)
    return true
  }, [supported])

  return { supported, permission, subscribed, subscribe }
}
