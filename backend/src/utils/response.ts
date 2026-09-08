import type { Response } from "express";

export function sendSuccess(
  res: Response,
  data: unknown,
  statusCode: number,
  message?: string,
) {
  return res.status(statusCode).json({
    success: true,
    ...(message !== undefined && { message }),
    data,
  });
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  code: string,
  details?: unknown,
) {
  return res.status(statusCode).json({
    success: false,
    message,
    code,
    error: {
      code,
      ...(details !== undefined && { details }),
    },
  });
}
