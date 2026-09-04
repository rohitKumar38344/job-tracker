import { NextFunction, Request, Response } from "express";
import {
  insertCompany,
  findCompaniesByUserId,
  findCompanyByIdAndUserId,
  updateCompanyData,
} from "./company.repository";
import {
  companyIdSchema,
  createCompanySchema,
  updateCompanySchema,
} from "./company.validation";

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

    return res.status(201).json({
      data: company,
    });
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
    return res.status(200).json({ data: companies });
  } catch (error) {
    return next(error);
  }
}

export async function getCompany(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // handle companyId = Number(abc) = NaN case
  try {
    const company = await findCompanyByIdAndUserId(
      Number(req.params.companyId),
      req.user!.userId,
    );
    if (!company) {
      return res.status(404).json({ message: "Company not found." });
    }
    return res.status(200).json({ data: company });
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
    return res.status(400).json({ message: "Invalid company ID." });
  }
  const result = updateCompanySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid data",
      errors: result.error.flatten().fieldErrors,
    });
  }
  try {
    const updatedCompany = await updateCompanyData(
      companyIdResult.data,
      req.user!.userId,
      result.data,
    );

    if (!updatedCompany) {
      return res.status(404).json({
        message: "Company not found.",
      });
    }
    return res.status(200).json({ data: updatedCompany });
  } catch (error) {
    return next(error);
  }
}
