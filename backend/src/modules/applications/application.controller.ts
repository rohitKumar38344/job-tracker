import { Request, Response, NextFunction } from "express";
import { applicationFilterSchema, createApplicationSchema } from "./application.validations";
import { formatError } from "zod";
import { addApplicationService } from "./application.service";
import { findApplicationsByUserId } from "./application.repository";

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

export async function getApplications(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsedQuery = applicationFilterSchema.safeParse(req.query);
  if(!parsedQuery.success){
    return res.status(400).json({message: "Invalid query", error: formatError(parsedQuery.error)})
  }
  try {
    const applications = await findApplicationsByUserId(req.user!.userId, parsedQuery.data);

    return res.status(200).json({ data: applications });
  } catch (error) {
    return next(error);
  }
}
