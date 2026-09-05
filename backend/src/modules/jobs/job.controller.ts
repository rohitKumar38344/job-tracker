import { Request, Response, NextFunction } from "express";
import { createJobSchema } from "./job.validation";
import { insertJob } from "./job.repository";

export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createJobSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: result.error.flatten().fieldErrors,
    });
  }
  try {
    const job = await insertJob(req.user!.userId, result.data);

    if (!job) {
      return res.status(404).json({
        message: "Company not found.",
      });
    }

    return res.status(201).json({
      data: job,
    });
  } catch (error) {
    return next(error);
  }
}
