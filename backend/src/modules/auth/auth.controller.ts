import { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema } from "./auth.validation";
import { registerUser, loginUser } from "./auth.service";
import { sendError, sendSuccess } from "../../utils/response";
import formatZodError from "../../utils/validation";

export async function register(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return sendError(res, 400, "Invalid request body", "VALIDATION_ERROR", formatZodError(result.error))
  }

  try {
    const user = await registerUser(result.data);
    return sendSuccess(res, user, 201)
  } catch (error) {
    return next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const result = loginSchema.safeParse(req.body);
  if (!result.success) {
    return sendError(res, 400, "Invalid request body", 'VALIDATION_ERROR', formatZodError(result.error))
  }

  try {
    const resultData = await loginUser(result.data);
    return sendSuccess(res, resultData, 200)
  } catch (error) {
    return next(error);
  }
}
