import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { verifyAccessToken } from "../utils/jwt";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      throw new AppError("Authentication required", 401);
    }

    const [scheme, token] = authorization.split(" ");
    if (scheme !== "Bearer" || !token) {
      throw new AppError("Invalid authorization header.", 401);
    }
    const payload = verifyAccessToken(token);

    req.user = {
      userId: payload.userId,
    };
    next();
  } catch (error) {
    next(error);
  }
}
