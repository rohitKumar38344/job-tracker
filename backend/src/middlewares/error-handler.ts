import { ErrorRequestHandler } from "express";
import { AppError } from "../errors/AppError";
import {
  JsonWebTokenError,
  TokenExpiredError,
  NotBeforeError,
} from "jsonwebtoken";

export const errorHandler: ErrorRequestHandler = (error, req, res, next) => {
  console.error(error);

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  if (error instanceof TokenExpiredError) {
    return res.status(401).json({ message: "Access token has expired." });
  }

  if (error instanceof NotBeforeError) {
    return res
      .status(401)
      .json({ message: "Authentication token is not active." });
  }

  if (error instanceof JsonWebTokenError) {
    return res.status(401).json({ message: "Invalid authentication token." });
  }

  return res.status(500).json({
    message: "Internal server error",
  });
};
