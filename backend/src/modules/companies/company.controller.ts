import { Request, Response } from "express";
import { createCompany as createCompanyRepository } from "./company.repository";
import { createCompanySchema } from "./company.validation";
import { isUniqueViolation } from "../../db/errors";

export async function createCompany(req: Request, res: Response) {
  const result = createCompanySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: result.error.flatten().fieldErrors,
    });
  }

  try {
    const company = await createCompanyRepository({
      userId: 1,
      companyName: result.data.companyName,
      industry: result.data.industry,
      location: result.data.location,
      companySize: result.data.companySize,
      companyUrl: result.data.companyUrl,
      notes: result.data.notes,
    });

    return res.status(201).json({
      data: company
    })
  } catch (error) {
    if(isUniqueViolation(error)){
      return res.status(409).json({
        message: "A company with this name already exists."
      })
    }
    console.error("Failed to create company: ", error)

    return res.status(500).json({
      message: "Failed to create company"
    })
  }
}
