import { pool } from "../../db";

export async function findDashboardStats(userId: number) {
  const totalJobsResult = await pool.query(
    `
    SELECT COUNT(*) FROM jobs AS j
    INNER JOIN companies AS c
      ON j.company_id = c.company_id
    WHERE c.user_id = $1`,
    [userId],
  );

  const totalApplicationsResult = await pool.query(
    `
    SELECT COUNT(*) FROM applications AS a
    INNER JOIN jobs AS j
      ON a.job_id = j.job_id
    INNER JOIN companies AS c
      ON j.company_id = c.company_id
    WHERE c.user_id = $1
    `,
    [userId],
  );

  const totalInterviewsResult = await pool.query(
    `
    SELECT COUNT(*) FROM interviews AS i
    INNER JOIN applications AS a
      ON i.application_id = a.application_id
    INNER JOIN jobs AS j
      ON a.job_id = j.job_id
    INNER JOIN companies AS c
      ON c.company_id = j.company_id
    WHERE c.user_id = $1`,
    [userId],
  );

  const applicationsByStatusResult = await pool.query(
    `
    SELECT a.current_status, COUNT(*) AS count
    FROM applications AS a
    INNER JOIN jobs AS j
      ON a.job_id = j.job_id
    INNER JOIN companies AS c
      ON c.company_id = j.company_id
    WHERE c.user_id = $1
    GROUP BY a.current_status
    `,
    [userId],
  );

  type ApplicationStatus =
    | "APPLIED"
    | "SCREENING"
    | "INTERVIEW"
    | "OFFER"
    | "REJECTED"
    | "WITHDRAWN";

  type ApplicationStatusRow = {
    current_status: ApplicationStatus;
    count: string;
  };

  const applicationsByStatus = {
    APPLIED: 0,
    SCREENING: 0,
    INTERVIEW: 0,
    OFFER: 0,
    REJECTED: 0,
    WITHDRAWN: 0,
  };
  for (const row of applicationsByStatusResult.rows as ApplicationStatusRow[]) {
    applicationsByStatus[row.current_status] = Number(row.count);
  }
  return {
    totalJobs: Number(totalJobsResult.rows[0].count),
    totalApplications: Number(totalApplicationsResult.rows[0].count),
    totalInterviews: Number(totalInterviewsResult.rows[0].count),
    applicationsByStatus,
  };
}
