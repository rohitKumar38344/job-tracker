import { Request, Response, NextFunction } from "express";
import {
  createJobSchema,
  filterJobSchema,
  jobIdSchema,
  updateJobSchema,
} from "./job.validation";
import {
  deleteJobData,
  filterJobsByUserId,
  findJobByUserIdAndJobId,
  insertJob,
} from "./job.repository";
import formatZodError from "../../utils/validation";
import { updateJobService } from "./job.service";

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

export async function getJob(req: Request, res: Response, next: NextFunction) {
  const jobId = jobIdSchema.safeParse(req.params.jobId);

  if (!jobId.success) {
    return res.status(400).json({ errors: jobId.error.flatten().fieldErrors });
  }
  try {
    const job = await findJobByUserIdAndJobId(req.user!.userId, jobId.data);

    if (!job) {
      return res.status(404).json({ message: "No job found." });
    }
    return res.status(200).json({ data: job });
  } catch (error) {
    return next(error);
  }
}

export async function filterJobs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedFilters = filterJobSchema.safeParse(req.query);
    console.log(parsedFilters.data);
    if (!parsedFilters.success) {
      return res.status(400).json({ message: "Invalid filters." });
    }
    const result = await filterJobsByUserId(
      req.user!.userId,
      parsedFilters.data,
    );
    return res
      .status(200)
      .json({ data: result.jobs, pagination: result.pagination });
  } catch (error) {
    return next(error);
  }
}

export async function updateJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // PATCH /api/jobs/:jobId
  const parsedJobId = jobIdSchema.safeParse(req.params.jobId);
  if (!parsedJobId.success) {
    return res.status(400).json({ message: "Invalid job id." });
  }

  const parsedInput = updateJobSchema.safeParse(req.body);

  if (!parsedInput.success) {
    return res
      .status(400)
      .json({
        message: "Invalid data.",
        errors: formatZodError(parsedInput.error),
      });
  }
  try {
    const result = await updateJobService(
      req.user!.userId,
      parsedJobId.data,
      parsedInput.data,
    );
    if (!result) {
      return res.status(404).json({ message: "Job not found." });
    }
    return res.status(200).json({ data: result });
  } catch (error) {
    return next(error);
  }
}

export async function deleteJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsedJobId = jobIdSchema.safeParse(req.params.jobId);

  if (!parsedJobId.success) {
    return res
      .status(400)
      .json({
        message: "Invalid job id.",
        errors: formatZodError(parsedJobId.error),
      });
  }
  try {
    const deletedJob = await deleteJobData(req.user!.userId, parsedJobId.data);
    if (!deletedJob) {
      return res.status(404).json({ message: "Job not found." });
    }
    return res
      .status(200)
      .json({ message: "Job deleted successfully.", data: {
        job_id: deletedJob.job_id,
        title: deletedJob.title,
        company_id: deletedJob.company_id
      } });
  } catch (error) {
    return next(error);
  }
}
