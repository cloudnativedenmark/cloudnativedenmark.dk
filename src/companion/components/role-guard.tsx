import React from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "../auth/auth-context"
import type { Role } from "../auth/auth-config"

const RoleGuard: React.FC<{ allow: Role[]; children: React.ReactNode }> = ({
  allow,
  children,
}) => {
  const { role } = useAuth()
  if (!role || !allow.includes(role)) {
    return <Navigate to="/companion" replace />
  }
  return <>{children}</>
}

export default RoleGuard
