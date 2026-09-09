import { Request, Response, NextFunction } from "express";
import {
  applicationFilterSchema,
  createApplicationSchema,
  applicationIdSchema,
  updateApplicationSchema,
} from "./application.validations";
import {
  addApplicationService,
  getApplicationByIdService,
  updateApplicationService,
} from "./application.service";
import {
  deleteApplicationData,
  findApplicationByIdAndUserId,
  findApplicationsByUserId,
} from "./application.repository";
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

export async function updateApplicationById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
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

    const parsedApplication = updateApplicationSchema.safeParse(req.body);
    if (!parsedApplication.success) {
      return sendError(
        res,
        400,
        "Validation failed.",
        "VALIDATION_ERROR",
        formatZodError(parsedApplication.error),
      );
    }

    const updatedApplication = await updateApplicationService(
      req.user!.userId,
      parsedApplicationId.data,
      parsedApplication.data,
    );
    if (updatedApplication === undefined) {
      return sendError(
        res,
        404,
        "Application not found.",
        "APPLICATION_NOT_FOUND",
      );
    }
    return sendSuccess(
      res,
      updatedApplication,
      200,
      "Application updated successfully.",
    );
  } catch (error) {
    return next(error);
  }
}

export async function deleteApplication(
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
      "Validation Failed.",
      "VALIDATION_ERROR",
      formatZodError(parsedApplicationId.error),
    );
  }

  try {
    const deletedApplication = await deleteApplicationData(
      req.user!.userId,
      parsedApplicationId.data,
    );

    if (deletedApplication === undefined) {
    return sendError(
      res,
      404,
      "Application not found.",
      "APPLICATION_NOT_FOUND",
    );
  }
    return sendSuccess(
      res,
      deletedApplication,
      200,
      "Application deleted successfully.",
    );
  } catch (error) {
    return next(error);
  }
}
