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
import { sendError, sendSuccess } from "../../utils/response";

export async function createJob(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createJobSchema.safeParse(req.body);

  if (!result.success) {
    return sendError(
      res,
      400,
      "Validation Failed.",
      "VALIDATION_ERROR",
      formatZodError(result.error),
    );
  }
  try {
    const job = await insertJob(req.user!.userId, result.data);

    if (!job) {
      return sendSuccess(res, job, 404, "Company not found");
    }

    return sendSuccess(res, job, 201);
  } catch (error) {
    return next(error);
  }
}

export async function getJob(req: Request, res: Response, next: NextFunction) {
  const jobId = jobIdSchema.safeParse(req.params.jobId);

  if (!jobId.success) {
    return sendError(
      res,
      400,
      "Validated failed.",
      "VALIDATION_ERROR",
      formatZodError(jobId.error),
    );
  }
  try {
    const job = await findJobByUserIdAndJobId(req.user!.userId, jobId.data);

    if (!job) {
      return sendSuccess(res, job, 404, "Job not found.");
    }
    return sendSuccess(res, job, 200);
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

    if (!parsedFilters.success) {
      return sendError(
        res,
        400,
        "Invalid filters",
        "VALIDATION_ERROR",
        formatZodError(parsedFilters.error),
      );
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
  const parsedJobId = jobIdSchema.safeParse(req.params.jobId);

  if (!parsedJobId.success) {
    return sendError(
      res,
      400,
      "Validation Failed.",
      "VALIDATION_ERROR",
      formatZodError(parsedJobId.error),
    );
  }

  const parsedInput = updateJobSchema.safeParse(req.body);

  if (!parsedInput.success) {
    return sendError(
      res,
      400,
      "Validation Failed.",
      "VALIDATION_ERROR",
      formatZodError(parsedInput.error),
    );
  }
  try {
    const result = await updateJobService(
      req.user!.userId,
      parsedJobId.data,
      parsedInput.data,
    );
    if (!result) {
      return sendError(res, 404, "Job not found.", "JOB_NOT_FOUND");
    }
    return sendSuccess(res, result, 200);
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
    return sendError(
      res,
      400,
      "Invalid job id.",
      "VALIDATION_ERROR",
      formatZodError(parsedJobId.error),
    );
  }
  try {
    const deletedJob = await deleteJobData(req.user!.userId, parsedJobId.data);
    if (!deletedJob) {
      return sendSuccess(res, deleteJob, 404, "Job not found.");
    }
    return res.status(200).json({
      message: "Job deleted successfully.",
      data: {
        job_id: deletedJob.job_id,
        title: deletedJob.title,
        company_id: deletedJob.company_id,
      },
    });
  } catch (error) {
    return next(error);
  }
}
