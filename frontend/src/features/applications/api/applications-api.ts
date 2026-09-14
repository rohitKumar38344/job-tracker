import { apiClient } from "@/lib/api-client"

export const applicationStatuses = [
  "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED", "WITHDRAWN",
] as const

export type ApplicationStatus = (typeof applicationStatuses)[number]

export interface Application {
  applicationId: number
  jobId: number
  jobTitle: string
  companyId: number
  companyName: string
  applicationDate: string
  currentStatus: ApplicationStatus
  resumeName: string | null
  coverLetterUsed: boolean
  referralSource: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface ApplicationInput {
  jobId: number
  applicationDate: string
  resumeName?: string
  coverLetterUsed?: boolean
  referralSource?: string
  notes?: string
}

type ApplicationResponse = {
  application_id: number; job_id: number; job_title: string; company_id: number
  company_name: string; application_date: string; current_status: ApplicationStatus
  resume_name: string | null; cover_letter_used: boolean; referral_source: string | null
  notes: string | null; created_at: string; updated_at: string
}

function mapApplication(application: ApplicationResponse): Application {
  return {
    applicationId: application.application_id, jobId: application.job_id,
    jobTitle: application.job_title, companyId: application.company_id,
    companyName: application.company_name, applicationDate: application.application_date,
    currentStatus: application.current_status, resumeName: application.resume_name,
    coverLetterUsed: application.cover_letter_used, referralSource: application.referral_source,
    notes: application.notes, createdAt: application.created_at, updatedAt: application.updated_at,
  }
}

export async function getApplications(status?: ApplicationStatus) {
  const query = status ? `?status=${status}` : ""
  const response = await apiClient<ApplicationResponse[]>(`applications${query}`)
  return response.data.map(mapApplication)
}

export async function createApplication(input: ApplicationInput) {
  const response = await apiClient<ApplicationResponse>("applications", { method: "POST", body: JSON.stringify(input) })
  return mapApplication(response.data)
}

export async function updateApplication(applicationId: number, input: Partial<Omit<ApplicationInput, "jobId">> & { currentStatus?: ApplicationStatus }) {
  const response = await apiClient<ApplicationResponse>(`applications/${applicationId}`, { method: "PATCH", body: JSON.stringify(input) })
  return mapApplication(response.data)
}

export async function deleteApplication(applicationId: number) {
  await apiClient(`applications/${applicationId}`, { method: "DELETE" })
}
