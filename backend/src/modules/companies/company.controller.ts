import { NextFunction, Request, Response } from "express";
import {
  insertCompany,
  findCompaniesByUserId,
} from "./company.repository";
import { createCompanySchema } from "./company.validation";

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
      userId: 1,
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
    const companies = await findCompaniesByUserId(1);
    return res.status(200).json({ data: companies });
  } catch (error) {
    return next(error);
  }
}
