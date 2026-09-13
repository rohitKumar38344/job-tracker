import { Navigate, Outlet } from "react-router"
import { useAuth } from "../context/auth-context"

export function ProtectedRoute() {
  const { isLoading, isAuthenticated } = useAuth()

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    )
  }
  if (!isAuthenticated) {
    return <Navigate to={"/login"} replace />
  }

  return <Outlet />
}
