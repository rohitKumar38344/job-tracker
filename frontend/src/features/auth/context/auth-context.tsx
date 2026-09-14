import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import { getNewAccessToken } from "@/lib/api-client"

import { clearAccessToken, setAccessToken } from "@/lib/auth-token"

import {
  getMe,
  login as loginUser,
  logout as logoutUser,
} from "../api/auth-api"

import type { AuthUser, LoginInput } from "../api/auth-api"

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null

  async function login(input: LoginInput) {
    const response = await loginUser(input)

    setAccessToken(response.data.accessToken)
    setUser(response.data.user)
  }

  async function logout() {
    try {
      await logoutUser()
    } finally {
      clearAccessToken()
      setUser(null)
    }
  }

  useEffect(() => {
    async function initializeAuth() {
      try {
        await getNewAccessToken()

        const meResponse = await getMe()

        setUser(meResponse.data)
      } catch {
        clearAccessToken()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    void initializeAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider")
  }

  return context
}
