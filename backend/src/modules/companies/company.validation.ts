import { z } from "zod";

export const createCompanySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(255, "Company name is too long"),

  industry: z.string().trim().max(255, "Industry name is too long").optional(),

  location: z.string().trim().max(150, "Location is too long").optional(),

  companySize: z.number().int("Company size must be a whole number").positive("Company size must be greater than 0").optional(),

  companyUrl: z.url("Invalid company URL").optional(),

  linkedinUrl: z.url("Invalid linkedin URL").optional(),

  notes: z.string().trim().optional(),
});

export const updateCompanySchema = z.object({
  companyName: z
    .string()
    .trim()
    .min(1, "Company name is required")
    .max(255, "Company name is too long")
    .optional(),

  industry: z.string().trim().max(255, "Industry name is too long").optional(),

  location: z.string().trim().max(150, "Location is too long").optional(),

  companySize: z.number().int("Company size must be a whole number").positive("Company size must be greater than 0").optional(),

  companyUrl: z.url("Invalid company URL").optional(),

  linkedinUrl: z.url("Invalid LinkedIn URL").optional(),

  notes: z.string().trim().optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  "At least one field must be provided for update."
);

export type CompanyUpdateInput = z.infer<typeof updateCompanySchema>

export const companyIdSchema = z.coerce.number().int().positive()