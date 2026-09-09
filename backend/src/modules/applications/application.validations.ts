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

export const applicationIdSchema = z.coerce.number().int().positive();
export type ApplicationId = z.infer<typeof applicationIdSchema>;

export const applicationStatusSchema = z.enum([
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
]);

export type ApplicationStatus = z.infer<
  typeof applicationStatusSchema
>;

export const updateApplicationSchema = z
  .object({
    applicationDate: z.coerce.date().optional(),
    resumeName: z.string().trim().optional(),
    coverLetterUsed: z.boolean().optional(),
    referralSource: z.string().trim().optional(),
    notes: z.string().trim().optional(),
    currentStatus: applicationStatusSchema.optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update.",
  );

export type UpdateApplicationInput = z.infer<typeof updateApplicationSchema>;

export type UpdateApplicationWithStatusInput =
  UpdateApplicationInput & {
    currentStatus: ApplicationStatus;
  };