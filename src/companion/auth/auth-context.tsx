import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { verifyPassphrase, type Role } from "./auth-config"
import { getItem, setItem, removeItem, StorageKeys } from "../data/storage"

function ensureDeviceId(): string {
  const existing = getItem<string | null>(StorageKeys.deviceId, null)
  if (existing) return existing
  const id = crypto.randomUUID()
  setItem(StorageKeys.deviceId, id)
  return id
}

interface AuthState {
  role: Role | null
  deviceId: string
  speakerId: string | null
  status: "idle" | "checking" | "error"
  error: string | null
}

interface AuthContextValue extends AuthState {
  unlock: (passphrase: string) => Promise<boolean>
  logout: () => void
  setSpeakerId: (id: string) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AuthState>(() => ({
    role: getItem<Role | null>(StorageKeys.role, null),
    deviceId: ensureDeviceId(),
    speakerId: getItem<string | null>(StorageKeys.speakerId, null),
    status: "idle",
    error: null,
  }))

  const unlock = useCallback(async (passphrase: string) => {
    setState((s) => ({ ...s, status: "checking", error: null }))
    const role = await verifyPassphrase(passphrase)
    if (!role) {
      setState((s) => ({
        ...s,
        status: "error",
        error: "That passphrase isn't recognized. Check with the info desk.",
      }))
      return false
    }
    setItem(StorageKeys.role, role)
    setState((s) => ({ ...s, role, status: "idle", error: null }))
    return true
  }, [])

  const logout = useCallback(() => {
    removeItem(StorageKeys.role)
    removeItem(StorageKeys.speakerId)
    setState((s) => ({
      ...s,
      role: null,
      speakerId: null,
      status: "idle",
      error: null,
    }))
  }, [])

  const setSpeakerId = useCallback((id: string) => {
    setItem(StorageKeys.speakerId, id)
    setState((s) => ({ ...s, speakerId: id }))
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({ ...state, unlock, logout, setSpeakerId }),
    [state, unlock, logout, setSpeakerId]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return ctx
}
