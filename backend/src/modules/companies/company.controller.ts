import { NextFunction, Request, Response } from "express";
import {
  insertCompany,
  findCompaniesByUserId,
  findCompanyByIdAndUserId,
  updateCompanyData,
  deleteCompanyData,
} from "./company.repository";
import {
  companyIdSchema,
  createCompanySchema,
  updateCompanySchema,
} from "./company.validation";
import { sendError, sendSuccess } from "../../utils/response";
import formatZodError from "../../utils/validation";

export async function createCompany(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = createCompanySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const company = await insertCompany({
      userId: req.user!.userId,
      companyName: result.data.companyName,
      industry: result.data.industry,
      location: result.data.location,
      companySize: result.data.companySize,
      companyUrl: result.data.companyUrl,
      notes: result.data.notes,
    });

    return sendSuccess(res, company, 201, "Company created successfully.");
  } catch (error) {
    return next(error);
  }
}

export async function getCompanies(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const companies = await findCompaniesByUserId(req.user!.userId);
    return sendSuccess(res, companies, 200);
  } catch (error) {
    return next(error);
  }
}

export async function getCompany(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const companyIdResult = companyIdSchema.safeParse(req.params.companyId);

    if (!companyIdResult.success) {
      return sendError(
        res,
        400,
        "Invalid company id.",
        "VALIDATION_ERROR",
        formatZodError(companyIdResult.error),
      );
    }
    const company = await findCompanyByIdAndUserId(
      companyIdResult.data,
      req.user!.userId,
    );
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    return sendSuccess(res, company, 200);
  } catch (error) {
    return next(error);
  }
}

export async function updateCompany(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const companyIdResult = companyIdSchema.safeParse(req.params.companyId);
  if (!companyIdResult.success) {
    return sendError(
      res,
      400,
      "Validation failed.",
      "VALIDATION_ERROR",
      formatZodError(companyIdResult.error),
    );
  }
  const result = updateCompanySchema.safeParse(req.body);

  if (!result.success) {
    return sendError(
      res,
      400,
      "Validation Failed.",
      "VALIDATION_ERROR",
      formatZodError(result.error),
    );
  }
  try {
    const updatedCompany = await updateCompanyData(
      companyIdResult.data,
      req.user!.userId,
      result.data,
    );

    if (!updatedCompany) {
      return sendSuccess(res, updateCompany, 404, "Company not found.");
    }
    return sendSuccess(res, updatedCompany, 200);
  } catch (error) {
    return next(error);
  }
}

export async function deleteCompany(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsedCompanyId = companyIdSchema.safeParse(req.params.companyId);

  if (!parsedCompanyId.success) {
    return sendError(
      res,
      400,
      "Invalid company id.",
      "VALIDATION_ERROR",
      formatZodError(parsedCompanyId.error),
    );
  }

  try {
    const result = await deleteCompanyData(
      req.user!.userId,
      parsedCompanyId.data,
    );

    if (!result) {
      return sendSuccess(res, result, 404, "Company not found.");
    }
    return sendSuccess(res, result, 200, "Company deleted successfully.");
  } catch (error) {
    return next(error);
  }
}
