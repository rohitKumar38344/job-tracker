import { pool } from "../../db";
import { isUniqueViolation } from "../../db/errors";
import { AppError } from "../../errors/AppError";

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

export async function findCompanyByIdAndUserId(companyId: number, userId: number){
const result = await pool.query(`
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
  `,[userId, companyId])
  return result.rows[0];
}
