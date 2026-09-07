import {z} from 'zod'

export const createApplicationSchema = z.object({
  jobId: z.coerce.number().int().positive(),
  applicationDate: z.coerce.date(),
  resumeName: z.string().trim().optional(),
  coverLetterUsed: z.boolean().optional().default(false),
  referralSource: z.string().trim().optional(),
  notes: z.string().trim().optional()
}).strict().refine((data) => data.applicationDate <= new Date(),{
  message: "Application date cannot be in the future.",
  path: ['applicationDate']
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>