import { Request, Response, NextFunction } from "express";
import {
  registerSchema,
  loginSchema,
} from "./auth.validation";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
} from "./auth.service";
import { sendError, sendSuccess } from "../../utils/response";
import formatZodError from "../../utils/validation";
import { refreshTokenCookieOptions } from "../../config/auth-cookie";
import { AppError } from "../../errors/AppError";
import { findUserById } from "./auth.repository";

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
    res.cookie(
      "refreshToken",
      resultData.refreshToken,
      refreshTokenCookieOptions,
    );
    return sendSuccess(
      res,
      { user: resultData.user, accessToken: resultData.accessToken },
      200,
    );
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
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      throw new AppError(
        "Refresh token is required.",
        401,
        "REFRESH_TOKEN_REQUIRED",
      );
    }

    const result = await refreshAccessToken(refreshToken);

    res.cookie("refreshToken", result.refreshToken, refreshTokenCookieOptions);

    return sendSuccess(res, { accessToken: result.accessToken }, 200);
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
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await logoutUser(refreshToken);
    }
    res.clearCookie("refreshToken", refreshTokenCookieOptions);
    return sendSuccess(res, null, 200, "Logged out successfully.");
  } catch (error) {
    return next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await findUserById(req.user!.userId);

    if (!user) {
      throw new AppError("User not found", 404, "USER_NOT_FOUND");
    }
    return sendSuccess(
      res,
      {
        userId: user.user_id,
        name: user.name,
        email: user.email,
      },
      200,
    );
  } catch (error) {
    return next(error);
  }
}
