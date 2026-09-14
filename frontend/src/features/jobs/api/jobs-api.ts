import { apiClient } from "@/lib/api-client";

import type {
  EmploymentType,
  Job,
  JobFilters,
  JobsResult,
  Pagination,
  WorkArrangement,
} from "../types/job";

import type {
  JobFormValues,
  UpdateJobInput,
} from "../schemas/job-schema";

interface JobApiResponse {
  job_id: number;
  company_id: number;
  company_name: string;
  title: string;
  description: string | null;
  location: string | null;
  employment_type: EmploymentType;
  work_arrangement: WorkArrangement | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  job_url: string | null;
  source: string | null;
  discovered_date: string | null;
  closing_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface DeleteJobApiResponse {
  job_id: number;
  title: string;
  company_id: number;
}

interface JobsApiResponse {
  jobs: JobApiResponse[];
  pagination: Pagination;
}

function mapJob(job: JobApiResponse): Job {
  return {
    jobId: job.job_id,
    companyId: job.company_id,
    companyName: job.company_name,
    title: job.title,
    description: job.description,
    location: job.location,
    employmentType: job.employment_type,
    workArrangement: job.work_arrangement,
    salaryMin: job.salary_min,
    salaryMax: job.salary_max,
    salaryCurrency: job.salary_currency,
    jobUrl: job.job_url,
    source: job.source,
    discoveredDate: job.discovered_date,
    closingAt: job.closing_at,
    notes: job.notes,
    createdAt: job.created_at,
    updatedAt: job.updated_at,
  };
}


function buildQueryParams(filters?: JobFilters) {
  const params = new URLSearchParams();

  if (!filters) {
    return params;
  }

  if (filters.title) {
    params.set("title", filters.title);
  }

  if (filters.description) {
    params.set("description", filters.description);
  }

  if (filters.location) {
    params.set("location", filters.location);
  }

  if (filters.employmentType) {
    params.set("employmentType", filters.employmentType);
  }

  if (filters.workArrangement) {
    params.set("workArrangement", filters.workArrangement);
  }

  if (filters.salaryMin !== undefined) {
    params.set("salaryMin", String(filters.salaryMin));
  }

  if (filters.salaryMax !== undefined) {
    params.set("salaryMax", String(filters.salaryMax));
  }

  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }

  if (filters.sortOrder) {
    params.set("sortOrder", filters.sortOrder);
  }

  if (filters.page !== undefined) {
    params.set("page", String(filters.page));
  }

  if (filters.limit !== undefined) {
    params.set("limit", String(filters.limit));
  }

  return params;
}

export async function getJob(
  jobId: number,
): Promise<Job> {
  const response =
    await apiClient<JobApiResponse>(`jobs/${jobId}`);

  return mapJob(response.data);
}

export async function getJobs(
  filters?: JobFilters,
): Promise<JobsResult> {
  const params = buildQueryParams(filters);

  const queryString = params.toString();

  const endpoint = queryString
    ? `jobs?${queryString}`
    : "jobs";

  const response =
    await apiClient<JobsApiResponse>(endpoint);

  return {
    jobs: response.data.jobs.map(mapJob),
    pagination: response.data.pagination,
  };
}

export async function createJob(
  input: JobFormValues,
): Promise<Job> {
  const response =
    await apiClient<JobApiResponse>("jobs", {
      method: "POST",
      body: JSON.stringify(input),
    });

  return mapJob(response.data);
}

export async function updateJob(
  jobId: number,
  input: UpdateJobInput,
): Promise<Job> {
  const response =
    await apiClient<JobApiResponse>(`jobs/${jobId}`, {
      method: "PATCH",
      body: JSON.stringify(input),
    });

  return mapJob(response.data);
}

export async function deleteJob(
  jobId: number,
): Promise<{
  jobId: number;
  companyId: number;
  title: string;
}> {
  const response =
    await apiClient<DeleteJobApiResponse>(
      `jobs/${jobId}`,
      {
        method: "DELETE",
      },
    );

  return {
    jobId: response.data.job_id,
    companyId: response.data.company_id,
    title: response.data.title,
  };
}
