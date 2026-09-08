import { z } from "zod";

export const createApplicationSchema = z
  .object({
    jobId: z.coerce.number().int().positive(),
    applicationDate: z.coerce.date(),
    resumeName: z.string().trim().optional(),
    coverLetterUsed: z.boolean().optional().default(false),
    referralSource: z.string().trim().optional(),
    notes: z.string().trim().optional(),
  })
  .strict()
  .refine((data) => data.applicationDate <= new Date(), {
    message: "Application date cannot be in the future.",
    path: ["applicationDate"],
  });

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export const applicationFilterSchema = z
  .object({
    status: z
      .enum([
        "APPLIED",
        "SCREENING",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
        "WITHDRAWN",
      ])
      .optional(),
    sortBy: z.enum(["applicationDate", "createdAt", "updatedAt"]).optional(),
    sortOrder: z.enum(["asc", "desc"]).optional(),
    applicationDateFrom: z.coerce.date().optional(),
    applicationDateTo: z.coerce.date().optional(),
  })
  .strict()
  .refine(
    (data) =>
      data.applicationDateFrom === undefined ||
      data.applicationDateTo === undefined ||
      data.applicationDateFrom <= data.applicationDateTo,
    {
      error:
        "applicationDateFrom must be before or equal to applicationDateTo.",
      path: ["applicationDateFrom"],
    },
  );

export type ApplicationFilters = z.infer<typeof applicationFilterSchema>;
