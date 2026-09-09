import { pool } from "../../db";
import {
  ApplicationFilters,
  CreateApplicationInput,
  UpdateApplicationInput,
  UpdateApplicationWithStatusInput,
} from "./application.validations";

export async function insertApplication(data: CreateApplicationInput) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // 1. Insert application
    const result = await client.query(
      `
      INSERT INTO applications (
      job_id,
      application_date,
      resume_name,
      cover_letter_used,
      referral_source,
      notes,
      current_status
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'APPLIED')
      RETURNING
        application_id,
        job_id,
        application_date,
        current_status,
        resume_name,
        cover_letter_used,
        referral_source,
        notes,
        created_at,
        updated_at;
      `,
      [
        data.jobId,
        data.applicationDate,
        data.resumeName,
        data.coverLetterUsed,
        data.referralSource,
        data.notes,
      ],
    );
    // 2. Insert initial history
    await client.query(
      `
      INSERT INTO application_history (
      application_id,
      status,
      changed_at
      )
      VALUES ($1, 'APPLIED', NOW())
      `,
      [result.rows[0].application_id],
    );
    // 3. Commit
    await client.query("COMMIT");
    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function findApplicationsByUserId(
  userId: number,
  query: ApplicationFilters,
) {
  const sortColMap = {
    applicationDate: "a.application_date",
    createdAt: "a.created_at",
    updatedAt: "a.updated_at",
  } as const;

  const conditions: string[] = ["c.user_id = $1"];
  const values: unknown[] = [userId];

  if (query.status !== undefined) {
    conditions.push(`a.current_status = $${values.length + 1}`);
    values.push(query.status);
  }
  if (query.applicationDateFrom !== undefined) {
    conditions.push(`a.application_date >= $${values.length + 1}`);
    values.push(query.applicationDateFrom);
  }
  if (query.applicationDateTo !== undefined) {
    conditions.push(`a.application_date <= $${values.length + 1}`);
    values.push(query.applicationDateTo);
  }
  const whereClause = conditions.join(" AND ");
  const sortCol = query.sortBy ? sortColMap[query.sortBy] : "a.created_at";
  const sortOrder = query.sortOrder === "asc" ? "ASC" : "DESC";
  const result = await pool.query(
    `
    SELECT
      a.application_id,
      j.job_id,
      j.title AS job_title,
      c.company_id,
      c.company_name,
      a.application_date,
      a.current_status,
      a.resume_name,
      a.cover_letter_used,
      a.referral_source,
      a.notes,
      a.created_at,
      a.updated_at
    FROM applications AS a
    INNER JOIN jobs AS j
      ON a.job_id = j.job_id
    INNER JOIN companies AS c
      ON j.company_id = c.company_id
    WHERE ${whereClause}
    ORDER BY ${sortCol} ${sortOrder}, a.application_id DESC
    `,
    values,
  );

  return result.rows;
}

export async function findApplicationByIdAndUserId(
  userId: number,
  applicationId: number,
) {
  const result = await pool.query(
    `
    SELECT
      a.application_id,
      j.job_id,
      j.title AS job_title,
      c.company_id,
      c.company_name,
      a.application_date,
      a.current_status,
      a.resume_name,
      a.cover_letter_used,
      a.referral_source,
      a.notes,
      a.created_at,
      a.updated_at
      
    FROM applications AS a
    INNER JOIN jobs AS j
     ON a.job_id = j.job_id
    INNER JOIN companies AS c
      ON j.company_id = c.company_id
    WHERE c.user_id = $1 AND a.application_id = $2 
    `,
    [userId, applicationId],
  );
  return result.rows[0];
}

export async function findApplicationHistory(applicationId: number) {
  const result = await pool.query(
    `
    SELECT
     application_history_id,
     status,
     changed_at
    FROM application_history
    WHERE application_id = $1
    ORDER BY changed_at ASC;
    `,
    [applicationId],
  );
  return result.rows;
}

export async function updateApplicationData(
  applicationId: number,
  data: UpdateApplicationInput,
) {
  const { fields, values } = buildUpdateFields(data);

  const result = await pool.query(
    `
      UPDATE applications
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE application_id = $${values.length + 1}
      RETURNING
        application_id,
        job_id,
        application_date,
        current_status,
        resume_name,
        cover_letter_used,
        referral_source,
        notes,
        created_at,
        updated_at;
    `,
    [...values, applicationId],
  );

  return result.rows[0];
}

export async function updateApplicationWithHistory(
  applicationId: number,
  data: UpdateApplicationWithStatusInput,
) {
  const { fields, values } = buildUpdateFields(data);
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const result = await client.query(
      `
      UPDATE applications
      SET ${fields.join(", ")}, updated_at = NOW()
      WHERE application_id = $${values.length + 1}
      RETURNING
        application_id,
        job_id,
        application_date,
        current_status,
        resume_name,
        cover_letter_used,
        referral_source,
        notes,
        created_at,
        updated_at;
    `,
      [...values, applicationId],
    );

    await client.query(
      `
      INSERT INTO application_history (
        application_id,
        status,
        changed_at
      ) VALUES ($1, $2, NOW());
    `,
      [applicationId, data.currentStatus],
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

function buildUpdateFields(data: UpdateApplicationInput) {
  const updateColMap = {
    applicationDate: "application_date",
    resumeName: "resume_name",
    coverLetterUsed: "cover_letter_used",
    referralSource: "referral_source",
    notes: "notes",
    currentStatus: "current_status",
  } as const;
  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(data)) {
    const col = key as keyof typeof updateColMap;
    if (!col) {
      throw new Error(`Unsupported update field: ${key}`);
    }

    fields.push(`${updateColMap[col]} = $${values.length + 1}`);
    values.push(value);
  }
  return { fields, values };
}

export async function deleteApplicationData(userId: number,applicationId: number){
  const result = await pool.query(`
    DELETE FROM applications As a
    USING jobs AS j
    JOIN companies AS c ON j.company_id = c.company_id
    WHERE a.job_id = j.job_id
      AND c.user_id = $1
      AND a.application_id = $2
    RETURNING a.application_id, a.job_id, a.current_status;
  `, [userId, applicationId]);
    
  return result.rows[0]
}