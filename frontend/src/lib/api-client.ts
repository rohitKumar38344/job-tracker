import type { ApiSuccessResponse } from "../types/api"
import { clearAccessToken, getAccessToken, setAccessToken } from "./auth-token"

const API_URL = import.meta.env.VITE_API_URL

type ApiOptions = RequestInit & {
  skipAuthRefresh?: boolean
}

let refreshPromise: Promise<string> | null = null

async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${API_URL}/auth/refresh`, {
    method: "POST",
    credentials: "include",
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? "Unable to refresh session.")
  }

  const accessToken = data.data.accessToken

  setAccessToken(accessToken)

  return accessToken
}

export async function getNewAccessToken(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null
    })
  }

  return refreshPromise
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiSuccessResponse<T>> {
  const { skipAuthRefresh, ...requestOptions } = options

  const accessToken = getAccessToken()

  const url = `${API_URL}${
    endpoint.startsWith("/") ? endpoint : `/${endpoint}`
  }`

  const response = await fetch(url, {
    ...requestOptions,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...requestOptions.headers,
    },
    credentials: "include",
  })

  if (response.status === 401 && !skipAuthRefresh) {
    try {
      const newAccessToken = await getNewAccessToken()

      return apiClient<T>(endpoint, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newAccessToken}`,
        },
        skipAuthRefresh: true,
      })
    } catch (error) {
      clearAccessToken()
      throw error
    }
  }

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? "Something went wrong.")
  }

  return data
}
