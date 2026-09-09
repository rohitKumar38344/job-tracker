import { pool } from "../../db";
import { CreateInterviewInput } from "./interview.validation";

export async function insertInterview(
  userId: number,
  applicationId: number,
  data: CreateInterviewInput,
) {
  const result = await pool.query(
    `
    INSERT INTO interviews (
      application_id,
      interview_type,
      scheduled_at,
      duration_minutes,
      meeting_link,
      location,
      interviewer,
      notes,
      result
    )
    SELECT
      a.application_id,
      $3,
      $4,
      $5,
      $6,
      $7,
      $8,
      $9,
      'PENDING'
    FROM applications AS a
    INNER JOIN jobs AS j
      ON a.job_id = j.job_id
    INNER JOIN companies AS c
      ON j.company_id = c.company_id
    WHERE a.application_id = $2
      AND c.user_id = $1
    RETURNING
      interview_id,
      application_id,
      interview_type,
      scheduled_at,
      duration_minutes,
      interviewer,
      meeting_link,
      location,
      result,
      notes,
      created_at,
      updated_at;
    `,
    [
      userId,
      applicationId,
      data.interviewType,
      data.scheduledAt,
      data.durationMinutes,
      data.meetingLink,
      data.location,
      data.interviewer,
      data.notes,
    ],
  );

  return result.rows[0];
}
