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

export type CreateInterviewInput = z.infer<typeof createInterviewSchema>