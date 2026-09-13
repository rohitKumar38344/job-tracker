import { z } from "zod"

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name is too long"),
  email: z.email("Invalid email address"),
  password: z
    .string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password is too long"),
})

export type RegisterFormValues = z.infer<typeof registerSchema>
