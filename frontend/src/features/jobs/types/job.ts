export type EmploymentType =
  "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP"

export type WorkArrangement = "REMOTE" | "HYBRID" | "ONSITE"

export type JobSortBy =
  "title" | "salaryMin" | "salaryMax" | "createdAt" | "discoveredDate"

export type SortOrder = "asc" | "desc"

export interface Job {
  jobId: number
  companyId: number
  companyName: string
  title: string
  description: string | null
  location: string | null
  employmentType: EmploymentType
  workArrangement: WorkArrangement | null
  salaryMin: number | null
  salaryMax: number | null
  salaryCurrency: string | null
  jobUrl: string | null
  source: string | null
  discoveredDate: string | null
  closingAt: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface JobFilters {
  title?: string
  description?: string
  location?: string
  employmentType?: EmploymentType
  workArrangement?: WorkArrangement
  salaryMin?: number
  salaryMax?: number
  sortBy?: JobSortBy
  sortOrder?: SortOrder
  page?: number
  limit?: number
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface JobsResult {
  jobs: Job[];
  pagination: Pagination;
}