import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";
import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";
import { sendError } from "../utils/response";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof AppError) {
    return sendError(res, error.statusCode, error.message, error.code);
  }

  if (error instanceof TokenExpiredError) {
    return sendError(res, 401, "Access token has expired.", "TOKEN_EXPIRED");
  }

  if (error instanceof NotBeforeError) {
    return sendError(
      res,
      401,
      "Authentication token is not active.",
      "TOKEN_NOT_ACTIVE",
    );
  }

  if (error instanceof JsonWebTokenError) {
    return sendError(
      res,
      401,
      "Invalid authentication token.",
      "INVALID_TOKEN",
    );
  }

  return sendError(res, 500, "Internal server error.", "INTERNAL_SERVER_ERROR");
};
