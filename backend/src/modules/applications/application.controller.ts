import { Request, Response, NextFunction } from "express";
import { createApplicationSchema } from "./application.validations";
import { formatError } from "zod";
import { addApplicationService } from "./application.service";

export async function createApplication(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsedApplication = createApplicationSchema.safeParse(req.body);
  if (!parsedApplication.success) {
    return res.status(400).json({
      message: "Invalid application data",
      errors: formatError(parsedApplication.error),
    });
  }
  try {
    const application = await addApplicationService(
      req.user!.userId,
      parsedApplication.data,
    );

    if (!application) {
      return res.status(404).json({ message: "Job not found." });
    }
    return res.status(201).json({
      message: "Application created successfully.",
      data: application,
    });
  } catch (error) {
    return next(error);
  }
}
