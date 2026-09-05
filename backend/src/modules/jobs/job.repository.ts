import { pool } from "../../db";
import { JobSchema } from "./job.validation";

export async function insertJob(
  userId: number,
  data: JobSchema,
) {
  const result = await pool.query(
    `
      INSERT INTO jobs (
        company_id,
        title,
        description,
        location,
        employment_type,
        work_arrangement,
        salary_min,
        salary_max,
        salary_currency,
        job_url,
        source,
        discovered_date,
        closing_at,
        notes
      )
      SELECT
        company_id,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14
      FROM companies
      WHERE company_id = $1
        AND user_id = $15
      RETURNING
        job_id,
        company_id,
        title,
        description,
        location,
        employment_type,
        work_arrangement,
        salary_min,
        salary_max,
        salary_currency,
        job_url,
        source,
        discovered_date,
        closing_at,
        notes,
        created_at,
        updated_at
    `,
    [
      data.companyId,
      data.title,
      data.description ?? null,
      data.location ?? null,
      data.employmentType,
      data.workArrangement ?? null,
      data.salaryMin ?? null,
      data.salaryMax ?? null,
      data.salaryCurrency ?? null,
      data.jobUrl ?? null,
      data.source ?? null,
      data.discoveredDate ?? null,
      data.closingAt ?? null,
      data.notes ?? null,
      userId,
    ],
  );

  return result.rows[0];
}