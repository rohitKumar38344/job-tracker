import { NextFunction, Request, Response } from "express";
import { findDashboardStats } from "./dashboard.repository";
import { sendSuccess } from "../../utils/response";

export async function getDashboardStats(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await findDashboardStats(req.user!.userId);

    return sendSuccess(res, result, 200);
  } catch (error) {
    return next(error);
  }
}
