import { NextFunction, Request, Response } from "express";
import { applicationIdSchema } from "../applications/application.validations";
import { sendError, sendSuccess } from "../../utils/response";
import formatZodError from "../../utils/validation";
import { createInterviewSchema } from "./interview.validation";
import { insertInterview } from "./interview.repository";

export async function createInterview(
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
        "Invalid application id.",
        "VALIDATION_ERROR",
        formatZodError(parsedApplicationId.error),
      );
    }

    const parsedInterview = createInterviewSchema.safeParse(req.body);
    if (!parsedInterview.success) {
      return sendError(
        res,
        400,
        "Validation failed.",
        "VALIDATION_ERROR",
        formatZodError(parsedInterview.error),
      );
    }

    const interview = await insertInterview(
      req.user!.userId,
      parsedApplicationId.data,
      parsedInterview.data,
    );

    // 4. Application doesn't exist or doesn't belong to user
    if (interview === undefined) {
      return sendError(
        res,
        404,
        "Application not found.",
        "APPLICATION_NOT_FOUND",
      );
    }

    return sendSuccess(res, interview, 201, "Interview created successfully.");
  } catch (error) {
    return next(error);
  }
}
