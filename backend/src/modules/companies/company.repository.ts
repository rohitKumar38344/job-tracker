import { pool } from "../../db";
import { isUniqueViolation } from "../../db/errors";
import { AppError } from "../../errors/AppError";
import { CompanyUpdateInput } from "./company.validation";

export type createCompanyData = {
  userId: number;
  companyName: string;
  industry?: string;
  location?: string;
  companySize?: number;
  companyUrl?: string;
  notes?: string;
};

export async function insertCompany(data: createCompanyData) {
  try {
    const result = await pool.query(
      `
     INSERT INTO companies (
       user_id,
       company_name,
       industry,
       location,
       company_size,
       company_url,
       notes
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING
       company_id,
       company_name,
       industry,
       location,
       company_size,
       company_url,
       notes,
       created_at,
       updated_at
     `,
      [
        data.userId,
        data.companyName,
        data.industry ?? null,
        data.location ?? null,
        data.companySize ?? null,
        data.companyUrl ?? null,
        data.notes ?? null,
      ],
    );

    return result.rows[0];
  } catch (error) {
    if (
      isUniqueViolation(error) &&
      error.constraint === "uq_company_per_user"
    ) {
      throw new AppError("A company with this name already exists.", 409);
    }
    throw error;
  }
}

export async function findCompaniesByUserId(userId: number) {
  const result = await pool.query(
    `SELECT 
    company_id,
    company_name,
    industry,
    location,
    company_size,
    company_url,
    linkedin_url,
    created_at,
    updated_at FROM companies WHERE user_id = $1 ORDER BY created_at DESC
    `,
    [userId],
  );
  return result.rows;
}

export async function findCompanyByIdAndUserId(
  companyId: number,
  userId: number,
) {
  const result = await pool.query(
    `
    SELECT
    company_id,
    company_name,
    industry,
    location,
    company_size,
    company_url,
    linkedin_url,
    created_at,
    updated_at
    FROM companies WHERE user_id = $1 AND company_id = $2
  `,
    [userId, companyId],
  );
  return result.rows[0];
}

export async function updateCompanyData(
  companyId: number,
  userId: number,
  data: CompanyUpdateInput,
) {
  // Remember:Identifiers are whitelisted. Values are parameterized
  const columnMap = {
    companyName: "company_name",
    industry: "industry",
    location: "location",
    companySize: "company_size",
    companyUrl: "company_url",
    linkedinUrl: "linkedin_url",
    notes: "notes",
  } as const;

  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(data)) {
    const column = columnMap[key as keyof typeof columnMap];
    fields.push(`${column} = $${values.length + 1}`);
    values.push(value);
  }

  fields.push("updated_at = NOW()");

  const userIdPlaceholder = values.length + 1;
  const companyIdPlaceholder = values.length + 2;
  try {
    const result = await pool.query(
      `
  UPDATE companies
  SET ${fields.join(", ")}
  WHERE user_id = $${userIdPlaceholder}
  AND company_id = $${companyIdPlaceholder}
  RETURNING
  company_id,
  company_name,
  industry,
  location,
  company_size,
  company_url,
  linkedin_url,
  notes,
  created_at,
  updated_at`,
      [...values, userId, companyId],
    );

    return result.rows[0];
  } catch (error) {
    if (
      isUniqueViolation(error) &&
      error.constraint === "uq_company_per_user"
    ) {
      throw new AppError(
        `A company with the name "${data.companyName}" already exists.`,
        409,
      );
    }
    throw error;
  }
}

export async function deleteCompanyData(userId: number, companyId: number){
 const result = await pool.query(`
  DELETE FROM companies WHERE company_id = $1 AND user_id = $2 RETURNING company_id, company_name`,[companyId, userId]);
  return result.rows[0]
}
