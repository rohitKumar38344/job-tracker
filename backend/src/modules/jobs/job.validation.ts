import { z } from "zod";

export const createJobSchema = z
  .object({
    companyId: z.coerce.number().int().positive(),
    title: z
      .string()
      .trim()
      .min(1, "Job title is required")
      .max(255, "Job title is too long"),
    description: z.string().trim().optional(),
    location: z.string().trim().optional(),
    employmentType: z.enum([
      "FULL_TIME",
      "PART_TIME",
      "CONTRACT",
      "INTERNSHIP",
    ]),
    workArrangement: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
    salaryMin: z.number().nonnegative().optional(),
    salaryMax: z.number().nonnegative().optional(),
    salaryCurrency: z
      .string()
      .length(3, "Currency must be a 3-letter code")
      .toUpperCase()
      .optional(),
    jobUrl: z.url("Invalid job URL").optional(),
    source: z.string().max(255).optional(),
    discoveredDate: z.coerce.date().optional(),
    closingAt: z.coerce.date().optional(),
    notes: z.string().trim().optional(),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMax >= data.salaryMin,
    {
      message:
        "Maximum salary must be greater than or equal to minimum salary.",
      path: ["salaryMax"],
    },
  );

export type JobSchema = z.infer<typeof createJobSchema>;

export const filterJobSchema = z
  .object({
    title: z.string().trim().min(1).optional(),
    description: z.string().min(1).optional(),
    location: z.string().trim().min(1).optional(),
    employmentType: z
      .enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP"])
      .optional(),
    workArrangement: z.enum(["REMOTE", "HYBRID", "ONSITE"]).optional(),
    salaryMin: z.coerce.number().nonnegative().optional(),
    salaryMax: z.coerce.number().nonnegative().optional(),

    sortBy: z.enum([
      "title",
      "salaryMin",
      "salaryMax",
      "createdAt",
      "discoveredDate",
    ]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
  })
  .refine(
    (data) =>
      data.salaryMin === undefined ||
      data.salaryMax === undefined ||
      data.salaryMax >= data.salaryMin,
    {
      message:
        "Maximum salary must be greater than or equal to minimum salary.",
      path: ["salaryMax"],
    },
  );

export type JobFilters = z.infer<typeof filterJobSchema>;
