import { pool } from "../../db";
import {
  CreateInterviewInput,
  UpdateInterviewInput,
} from "./interview.validation";

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

export async function findInterviewsByApplicationIdAndUserId(
  userId: number,
  applicationId: number,
) {
  const applicationResult = await pool.query(
    `
    SELECT a.application_id
    FROM applications AS a
    INNER JOIN jobs AS j
      ON j.job_id = a.job_id
    INNER JOIN companies AS c
      ON c.company_id = j.company_id
    WHERE c.user_id = $1
    AND a.application_id = $2
    `,
    [userId, applicationId],
  );

  if (applicationResult.rows.length === 0) {
    return undefined;
  }

  const interviewResult = await pool.query(
    `
    SELECT
      i.interview_id,
      i.application_id,
      c.company_name,
      j.title,
      i.interview_type,
      i.scheduled_at,
      i.duration_minutes,
      i.interviewer,
      i.meeting_link,
      i.location,
      i.result,
      i.notes,
      i.created_at,
      i.updated_at
    FROM interviews AS i
    INNER JOIN applications AS a
      ON i.application_id = a.application_id
    INNER JOIN jobs AS j
      ON j.job_id = a.job_id
    INNER JOIN companies AS c
      ON c.company_id = j.company_id
    WHERE c.user_id = $1
      AND a.application_id = $2
    ORDER BY i.scheduled_at ASC, i.interview_id ASC
    `,
    [userId, applicationId],
  );

  return interviewResult.rows;
}

export async function findInterviewByIdAndUserId(
  userId: number,
  interviewId: number,
) {
  const result = await pool.query(
    `
    SELECT
      i.interview_id,
      i.application_id,
      c.company_name,
      j.title,
      i.interview_type,
      i.scheduled_at,
      i.duration_minutes,
      i.interviewer,
      i.meeting_link,
      i.location,
      i.result,
      i.notes,
      i.created_at,
      i.updated_at
    FROM interviews AS i
    INNER JOIN applications AS a
      ON a.application_id = i.application_id
    INNER JOIN jobs AS j
      ON j.job_id = a.job_id
    INNER JOIN companies AS c
      ON c.company_id = j.company_id
    WHERE c.user_id = $1
      AND i.interview_id = $2
    `,
    [userId, interviewId],
  );

  return result.rows[0];
}

export async function updateInterviewData(
  userId: number,
  interviewId: number,
  data: UpdateInterviewInput,
) {
  const colMap = {
    interviewType: "interview_type",
    scheduledAt: "scheduled_at",
    durationMinutes: "duration_minutes",
    interviewer: "interviewer",
    meetingLink: "meeting_link",
    location: "location",
    result: "result",
    notes: "notes",
  };

  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(data)) {
    const col = key as keyof typeof colMap;
    fields.push(`${colMap[col]} = $${values.length + 1}`);
    values.push(value);
  }
  fields.push("updated_at = NOW()");
  const result = await pool.query(
    `
    UPDATE interviews AS i
    SET ${fields.join(", ")}
    FROM applications AS a
    INNER JOIN jobs AS j
      ON j.job_id = a.job_id
    INNER JOIN companies AS c
      ON c.company_id = j.company_id
    WHERE i.application_id = a.application_id
      AND c.user_id = $${values.length + 1}
      AND i.interview_id = $${values.length + 2}
    RETURNING
      i.interview_id,
      i.application_id,
      i.interview_type,
      i.scheduled_at,
      i.duration_minutes,
      i.interviewer,
      i.meeting_link,
      i.location,
      i.result,
      i.notes,
      i.created_at,
      i.updated_at
    `,
    [...values, userId, interviewId],
  );
  return result.rows[0];
}

export async function deleteInterviewData(userId: number, interviewId: number) {
  const result = await pool.query(
    `
    DELETE FROM interviews AS i
    USING applications AS a
    INNER JOIN jobs as j
      ON a.job_id = j.job_id
    INNER JOIN companies as c
      ON c.company_id = j.company_id
    WHERE i.application_id = a.application_id
      AND c.user_id = $1
      AND i.interview_id = $2
    RETURNING
      i.interview_id,
      i.application_id,
      c.company_name,
      j.title`,
    [userId, interviewId],
  );
  return result.rows[0];
}
