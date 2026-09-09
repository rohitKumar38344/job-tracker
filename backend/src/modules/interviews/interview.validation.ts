import { z } from "zod";

export const createInterviewSchema = z
  .object({
    interviewType: z.enum([
      "PHONE_SCREEN",
      "TECHNICAL",
      "BEHAVIORAL",
      "SYSTEM_DESIGN",
      "HR",
      "FINAL",
    ]),
    scheduledAt: z.coerce.date(),
    durationMinutes: z.number().int().positive(),
    interviewer: z.string().trim().max(100).optional(),
    meetingLink: z.url().optional(),
    location: z.string().trim().max(100).optional(),
    notes: z.string().trim().optional(),
  })
  .strict();

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;

export const interviewIdSchema = z.coerce.number().int().positive();

export const updateInterviewSchema = z
  .object({
    interviewType: z
      .enum([
        "PHONE_SCREEN",
        "TECHNICAL",
        "BEHAVIORAL",
        "SYSTEM_DESIGN",
        "HR",
        "FINAL",
      ])
      .optional(),
    scheduledAt: z.coerce.date().optional(),
    durationMinutes: z.number().int().positive().optional(),
    interviewer: z.string().trim().max(100).optional(),
    meetingLink: z.url().optional(),
    location: z.string().trim().max(100).optional(),
    result: z.enum(["PENDING", "PASSED", "FAILED", "CANCELLED", "NO_SHOW"]).optional(),
    notes: z.string().trim().optional(),
  })
  .strict()
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field must be provided for update.",
  );

export type UpdateInterviewInput = z.infer<typeof updateInterviewSchema>;