import { pool } from "../../db";
import { JobFilters, JobSchema, UpdateJobInput } from "./job.validation";

export async function insertJob(userId: number, data: JobSchema) {
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

export async function findJobByUserIdAndJobId(userId: number, jobId: number) {
  const result = await pool.query(
    `
    SELECT
    j.job_id,
    c.company_id,
    c.company_name,
    j.title,
    j.description,
    j.location,
    j.employment_type,
    j.work_arrangement,
    j.salary_min,
    j.salary_max,
    j.salary_currency,
    j.job_url,
    j.source,
    j.discovered_date,
    j.closing_at,
    j.notes,
    j.created_at,
    j.updated_at
    FROM companies AS c
    INNER JOIN jobs AS j
      ON c.company_id = j.company_id
    WHERE c.user_id = $1 AND j.job_id = $2
    `,
    [userId, jobId],
  );

  return result.rows[0];
}

export async function filterJobsByUserId(userId: number, data: JobFilters) {
  const whereClause: string[] = ["c.user_id = $1"];
  const values: unknown[] = [userId];

  if (data.title) {
    whereClause.push(`j.title ILIKE $${values.length + 1}`);
    values.push(`%${data.title}%`);
  }
  if (data.description) {
    whereClause.push(`j.description ILIKE $${values.length + 1}`);
    values.push(`%${data.description}%`);
  }
  if (data.location) {
    whereClause.push(`j.location ILIKE $${values.length + 1}`);
    values.push(`%${data.location}%`);
  }
  if (data.employmentType) {
    whereClause.push(`j.employment_type = $${values.length + 1}`);
    values.push(data.employmentType);
  }
  if (data.workArrangement) {
    whereClause.push(`j.work_arrangement = $${values.length + 1}`);
    values.push(data.workArrangement);
  }
  if (data.salaryMin !== undefined) {
    whereClause.push(
      `(j.salary_max IS NULL OR j.salary_max >= $${values.length + 1})`,
    );
    values.push(data.salaryMin);
  }
  if (data.salaryMax !== undefined) {
    whereClause.push(
      `(j.salary_min IS NULL OR j.salary_min <= $${values.length + 1})`,
    );
    values.push(data.salaryMax);
  }
  // console.log('whereclause',whereClause, values)
  const sortOrder = data.sortOrder === "asc" ? "ASC" : "DESC";
  const sortColMap = {
    title: "j.title",
    salaryMin: "j.salary_min",
    salaryMax: "j.salary_max",
    createdAt: "j.created_at",
    discoveredDate: "j.discovered_date",
  } as const;

  const sortCol = data.sortBy ? sortColMap[data.sortBy] : "j.created_at";

  const offset = (data.page - 1) * data.limit;
  const whereSql = whereClause.join(" AND ");
  const result = await pool.query(
    `
    SELECT
    j.job_id,
    c.company_id,
    c.company_name,
    j.title,
    j.description,
    j.location,
    j.employment_type,
    j.work_arrangement,
    j.salary_min,
    j.salary_max,
    j.salary_currency,
    j.job_url,
    j.source,
    j.discovered_date,
    j.closing_at,
    j.notes,
    j.created_at,
    j.updated_at
    FROM companies AS c
    INNER JOIN jobs AS j
      ON c.company_id = j.company_id
    WHERE ${whereSql}
    ORDER BY ${sortCol} ${sortOrder}, j.job_id DESC
    LIMIT $${values.length + 2}
    OFFSET $${values.length + 1}
    `,
    [...values, offset, data.limit],
  );
  const countResult = await pool.query(
    `
    SELECT
    COUNT(*) AS total
    FROM companies AS c
    INNER JOIN jobs AS j
      ON c.company_id = j.company_id
    WHERE ${whereSql}
    `,
    values,
  );
  const total = Number(countResult.rows[0].total);
  const totalPages = Math.ceil(total / data.limit);
  return {
    jobs: result.rows,
    pagination: {
      page: data.page,
      limit: data.limit,
      total,
      totalPages,
    },
  };
}

export async function updateJobData(
  userId: number,
  jobId: number,
  data: UpdateJobInput,
) {
  const updateColMap = {
    title: "title",
    description: "description",
    location: "location",
    employmentType: "employment_type",
    workArrangement: "work_arrangement",
    salaryMin: "salary_min",
    salaryMax: "salary_max",
    salaryCurrency: "salary_currency",
    jobUrl: "job_url",
    source: "source",
    discoveredDate: "discovered_date",
    closingAt: "closing_at",
    notes: "notes",
  } as const;

  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(data)) {
    const column = updateColMap[key as keyof typeof updateColMap];

    fields.push(`${column} = $${values.length + 1}`);
    values.push(value);
  }

  fields.push("updated_at = NOW()");

  const jobIdPlaceholder = values.length + 1;
  const userIdPlaceholder = values.length + 2;

  const result = await pool.query(
    `
    UPDATE jobs AS j
    SET
      ${fields.join(", ")}
    FROM companies AS c
    WHERE j.company_id = c.company_id
      AND j.job_id = $${jobIdPlaceholder}
      AND c.user_id = $${userIdPlaceholder}
    RETURNING
      j.job_id,
      j.company_id,
      c.company_name,
      j.title,
      j.description,
      j.location,
      j.employment_type,
      j.work_arrangement,
      j.salary_min,
      j.salary_max,
      j.salary_currency,
      j.job_url,
      j.source,
      j.discovered_date,
      j.closing_at,
      j.notes,
      j.created_at,
      j.updated_at
    `,
    [...values, jobId, userId],
  );

  return result.rows[0];
}

export async function deleteJobData(userId: number, jobId: number) {
  const result = await pool.query(
    `
    DELETE FROM jobs AS j
    USING companies AS c
    WHERE c.company_id = j.company_id
    AND c.user_id = $1
    AND j.job_id = $2
    RETURNING
     j.job_id,
     j.title,
     c.company_id
    `,
    [userId, jobId],
  );

  return result.rows[0];
}
