import { NextFunction, Request, Response } from "express";
import { applicationIdSchema } from "../applications/application.validations";
import { sendError, sendSuccess } from "../../utils/response";
import formatZodError from "../../utils/validation";
import {
  createInterviewSchema,
  interviewIdSchema,
  updateInterviewSchema,
} from "./interview.validation";
import {
  deleteInterviewData,
  findInterviewByIdAndUserId,
  findInterviewsByApplicationIdAndUserId,
  insertInterview,
  updateInterviewData,
} from "./interview.repository";

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

export async function getInterviews(
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
    const interviews = await findInterviewsByApplicationIdAndUserId(
      req.user!.userId,
      parsedApplicationId.data,
    );

    if (interviews === undefined) {
      return sendError(
        res,
        404,
        "Application not found.",
        "APPLICATION_NOT_FOUND",
      );
    }
    return sendSuccess(res, interviews, 200);
  } catch (error) {
    return next(error);
  }
}

export async function getInterview(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedInterviewId = interviewIdSchema.safeParse(
      req.params.interviewId,
    );

    if (!parsedInterviewId.success) {
      return sendError(
        res,
        400,
        "Invalid interview id.",
        "VALIDATION_ERROR",
        formatZodError(parsedInterviewId.error),
      );
    }

    const interview = await findInterviewByIdAndUserId(
      req.user!.userId,
      parsedInterviewId.data,
    );

    if (!interview) {
      return sendError(res, 404, "Interview not found.", "INTERVIEW_NOT_FOUND");
    }

    return sendSuccess(res, interview, 200);
  } catch (error) {
    return next(error);
  }
}

export async function updateInterview(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedInterviewId = interviewIdSchema.safeParse(
      req.params.interviewId,
    );

    if (!parsedInterviewId.success) {
      return sendError(
        res,
        400,
        "Invalid interview id.",
        "VALIDATION_ERROR",
        formatZodError(parsedInterviewId.error),
      );
    }
    const parsedInterview = updateInterviewSchema.safeParse(req.body);
    if (!parsedInterview.success) {
      return sendError(
        res,
        400,
        "Invalid data.",
        "VALIDATION_ERROR",
        formatZodError(parsedInterview.error),
      );
    }
    const interviewData = await updateInterviewData(
      req.user!.userId,
      parsedInterviewId.data,
      parsedInterview.data,
    );
    if (interviewData === undefined) {
      return sendError(res, 404, "Interview not found.", "INTERVIEW_NOT_FOUND");
    }

    return sendSuccess(
      res,
      interviewData,
      200,
      "Interview updated successfully.",
    );
  } catch (error) {
    return next(error);
  }
}

export async function deleteInterview(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedInterviewId = interviewIdSchema.safeParse(
      req.params.interviewId,
    );

    if (!parsedInterviewId.success) {
      return sendError(
        res,
        400,
        "Invalid interview id.",
        "VALIDATION_ERROR",
        formatZodError(parsedInterviewId.error),
      );
    }

    const deletedInterview = await deleteInterviewData(
      req.user!.userId,
      parsedInterviewId.data,
    );

    if (deletedInterview === undefined) {
      return sendError(res, 404, "Interview not found.", "INTERVIEW_NOT_FOUND");
    }

    return sendSuccess(
      res,
      deletedInterview,
      200,
      "Interview deleted successfully.",
    );
  } catch (error) {
    return next(error);
  }
}
