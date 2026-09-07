import { pool } from "../../db";
import { CreateApplicationInput } from "./application.validations";

export async function insertApplication(
  data: CreateApplicationInput,
) {
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
        data.notes
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
    return result.rows[0]
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}
