import { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from "./auth.validation";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "./auth.service";
import { sendError, sendSuccess } from "../../utils/response";
import formatZodError from "../../utils/validation";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return sendError(
      res,
      400,
      "Invalid request body",
      "VALIDATION_ERROR",
      formatZodError(result.error),
    );
  }

  try {
    const user = await registerUser(result.data);
    return sendSuccess(res, user, 201);
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return sendError(
      res,
      400,
      "Invalid request body",
      "VALIDATION_ERROR",
      formatZodError(result.error),
    );
  }

  try {
    const resultData = await loginUser(result.data);
    return sendSuccess(res, resultData, 200);
  } catch (error) {
    return next(error);
  }
}

export async function refreshTokenController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedToken = refreshTokenSchema.safeParse(req.body);
    if (!parsedToken.success) {
      return sendError(
        res,
        400,
        "Validation Failed.",
        "VALIDATION_ERROR",
        formatZodError(parsedToken.error),
      );
    }

    // call service
    const newAccessToken = await refreshAccessToken(
      parsedToken.data.refreshToken,
    );
    // send success
    return sendSuccess(res, newAccessToken, 200);
  } catch (error) {
    return next(error);
  }
}

export async function logoutController(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const parsedToken = refreshTokenSchema.safeParse(req.body);
    if (!parsedToken.success) {
      return sendError(
        res,
        400,
        "Validation Failed.",
        "VALIDATION_ERROR",
        formatZodError(parsedToken.error),
      );
    }
    await logoutUser(parsedToken.data.refreshToken);

    return sendSuccess(res, null, 200, "Logged out successfully.");
  } catch (error) {
    return next(error);
  }
}
