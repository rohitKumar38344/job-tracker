import { Request, Response, NextFunction } from "express";
import {
  applicationFilterSchema,
  createApplicationSchema,
  applicationIdSchema,
} from "./application.validations";
import { addApplicationService, getApplicationByIdService } from "./application.service";
import { findApplicationsByUserId, findApplicationByIdAndUserId } from "./application.repository";
import formatZodError from "../../utils/validation";
import { sendError, sendSuccess } from "../../utils/response";

export async function createApplication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsedApplication = createApplicationSchema.safeParse(req.body);
  if (!parsedApplication.success) {
    return sendError(
      res,
      400,
      "Validation failed.",
      "VALIDATION_ERROR",
      formatZodError(parsedApplication.error),
    );
  }
  try {
    const application = await addApplicationService(
      req.user!.userId,
      parsedApplication.data,
    );

    if (!application) {
      return sendError(res, 404, "Job not found.", "JOB_NOT_FOUND");
    }
    return sendSuccess(
      res,
      application,
      201,
      "Application created successfully.",
    );
  } catch (error) {
    return next(error);
  }
}

export async function getApplications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsedQuery = applicationFilterSchema.safeParse(req.query);
  if (!parsedQuery.success) {
    return sendError(
      res,
      400,
      "Validation failed.",
      "VALIDATION_ERROR",
      formatZodError(parsedQuery.error),
    );
  }
  try {
    const applications = await findApplicationsByUserId(
      req.user!.userId,
      parsedQuery.data,
    );
    return sendSuccess(res, applications, 200);
  } catch (error) {
    return next(error);
  }
}

export async function getApplicationById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsedApplicationId = applicationIdSchema.safeParse(
    req.params.applicationId,
  );
  if (!parsedApplicationId.success) {
    return sendError(
      res,
      400,
      "Validation failed.",
      "VALIDATION_ERROR",
      formatZodError(parsedApplicationId.error),
    );
  }

  try {
    const application = await getApplicationByIdService(
      req.user!.userId,
      parsedApplicationId.data,
    );
    if (!application) {
      return sendError(
        res,
        404,
        "Application not found.",
        "APPLICATION_NOT_FOUND",
      );
    }
    return sendSuccess(res, application, 200);
  } catch (error) {
    return next(error);
  }
}
