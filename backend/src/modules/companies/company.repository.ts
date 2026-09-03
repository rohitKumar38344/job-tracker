import { pool } from "../../db";

export type createCompanyData = {
  userId: number;
  companyName: string;
  industry?: string;
  location?: string;
  companySize?: number;
  companyUrl?: string;
  notes?: string;
};

export async function createCompany(data: createCompanyData) {
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
}
