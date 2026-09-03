import {z} from 'zod'

export const createCompanySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(255, "Company name is too long"),
  
  industry: z
    .string()
    .trim()
    .max(255, "Industry name is too long")
    .optional(),

  location: z
    .string()
    .trim()
    .optional(),

  companySize: z
    .number()
    .int()
    .positive()
    .optional(),

  companyUrl: z
    .url()
    .optional(),

  notes: z
    .string()
    .trim()
    .optional(),
})