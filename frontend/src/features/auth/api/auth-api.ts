import { apiClient } from "@/lib/api-client"

export interface AuthUser {
  userId: number
  name: string
  email: string
}

export interface RegisterInput {
  name: string
  email: string
  password: string
}

export interface LoginInput {
  email: string
  password: string
}

export async function register(input: RegisterInput) {
  return apiClient<AuthUser>("auth/register", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function login(input: LoginInput) {
  return apiClient<{ user: AuthUser; accessToken: string }>("auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  })
}

export async function getMe() {
  return apiClient<AuthUser>("auth/me")
}

export async function logout() {
  return apiClient<null>("auth/logout", {
    method: "POST",
  })
}
