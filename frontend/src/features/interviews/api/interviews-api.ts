import { apiClient } from "@/lib/api-client"

export const interviewTypes = [
  "PHONE_SCREEN",
  "TECHNICAL",
  "BEHAVIORAL",
  "SYSTEM_DESIGN",
  "HR",
  "FINAL",
] as const
export const interviewResults = [
  "PENDING",
  "PASSED",
  "FAILED",
  "CANCELLED",
  "NO_SHOW",
] as const
export type InterviewType = (typeof interviewTypes)[number]
export type InterviewResult = (typeof interviewResults)[number]

export interface Interview {
  interviewId: number
  applicationId: number
  jobTitle?: string
  companyName?: string
  interviewType: InterviewType
  scheduledAt: string
  durationMinutes: number
  interviewer: string | null
  meetingLink: string | null
  location: string | null
  result: InterviewResult
  notes: string | null
}
export interface InterviewInput {
  interviewType: InterviewType
  scheduledAt: string
  durationMinutes: number
  interviewer?: string
  meetingLink?: string
  location?: string
  notes?: string
}
type InterviewResponse = {
  interview_id: number
  application_id: number
  title?: string
  company_name?: string
  interview_type: InterviewType
  scheduled_at: string
  duration_minutes: number
  interviewer: string | null
  meeting_link: string | null
  location: string | null
  result: InterviewResult
  notes: string | null
}
function mapInterview(value: InterviewResponse): Interview {
  return {
    interviewId: value.interview_id,
    applicationId: value.application_id,
    jobTitle: value.title,
    companyName: value.company_name,
    interviewType: value.interview_type,
    scheduledAt: value.scheduled_at,
    durationMinutes: value.duration_minutes,
    interviewer: value.interviewer,
    meetingLink: value.meeting_link,
    location: value.location,
    result: value.result,
    notes: value.notes,
  }
}
export async function getInterviews(applicationId: number) {
  const response = await apiClient<InterviewResponse[]>(
    `applications/${applicationId}/interviews`
  )
  return response.data.map(mapInterview)
}
export async function createInterview(
  applicationId: number,
  input: InterviewInput
) {
  const response = await apiClient<InterviewResponse>(
    `applications/${applicationId}/interviews`,
    { method: "POST", body: JSON.stringify(input) }
  )
  return mapInterview(response.data)
}
export async function updateInterview(
  interviewId: number,
  input: Partial<InterviewInput> & { result?: InterviewResult }
) {
  const response = await apiClient<InterviewResponse>(
    `interviews/${interviewId}`,
    { method: "PATCH", body: JSON.stringify(input) }
  )
  return mapInterview(response.data)
}
export async function deleteInterview(interviewId: number) {
  await apiClient(`interviews/${interviewId}`, { method: "DELETE" })
}
