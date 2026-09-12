import type { ApiSuccessResponse } from "@/types/api"
import { getAccessToken } from "./auth-token"

const API_URL = import.meta.env.VITE_API_URL

type ApiOptions = RequestInit & {
  accessToken?: string
}

export async function apiClient<T>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<ApiSuccessResponse<T>> {
  const accessToken = getAccessToken();

  const response = await fetch(`${API_URL}/${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken
        ? {
            Authorization: `Beareer ${accessToken}`,
          }
        : {}),
      ...options.headers,
    },
    credentials: "include",
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message ?? "Something went wrong.")
  }
  return data
}
