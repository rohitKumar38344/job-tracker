import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createInterview,
  deleteInterview,
  getInterviews,
  updateInterview,
  type InterviewInput,
} from "../api/interviews-api"

export function useInterviews(applicationId: number) {
  return useQuery({
    queryKey: ["interviews", applicationId],
    queryFn: () => getInterviews(applicationId),
    enabled: applicationId > 0,
  })
}
export function useCreateInterview() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      applicationId,
      input,
    }: {
      applicationId: number
      input: InterviewInput
    }) => createInterview(applicationId, input),
    onSuccess: () => client.invalidateQueries({ queryKey: ["interviews"] }),
  })
}
export function useUpdateInterview() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({
      interviewId,
      input,
    }: {
      interviewId: number
      input: Parameters<typeof updateInterview>[1]
    }) => updateInterview(interviewId, input),
    onSuccess: () => client.invalidateQueries({ queryKey: ["interviews"] }),
  })
}
export function useDeleteInterview() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: deleteInterview,
    onSuccess: () => client.invalidateQueries({ queryKey: ["interviews"] }),
  })
}
