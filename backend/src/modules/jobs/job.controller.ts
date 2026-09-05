import { Request, Response, NextFunction } from "express";
import { createJobSchema, filterJobSchema } from "./job.validation";
import { filterJobsByUserId, findJobsByUserId, insertJob } from "./job.repository";

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

export async function getJobs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const jobs = await findJobsByUserId(req.user!.userId);

    return res.status(200).json({ data: jobs });
  } catch (error) {
    return next(error);
  }
}

export async function filterJobs(req: Request, res: Response, next: NextFunction){
  try {
    const parsedFilters = filterJobSchema.safeParse(req.query)
    console.log(parsedFilters.data)
    if(!parsedFilters.success){
      return res.status(400).json({message: "Invalid filters."})
    }
    const jobs = await filterJobsByUserId(req.user!.userId, parsedFilters.data);
    return res.status(200).json({data: jobs})
  } catch (error) {
    return next(error)
  }
}