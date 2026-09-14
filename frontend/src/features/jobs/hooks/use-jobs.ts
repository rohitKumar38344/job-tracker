import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  getJob,
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../api/jobs-api"
import type { JobFilters } from "../types/job"
import type { UpdateJobInput } from "../schemas/job-schema"

export function useJobs(filters?: JobFilters) {
  return useQuery({
    queryKey: ["jobs", 'list', filters],
    queryFn: () => getJobs(filters),
  })
}

export function useJob(jobId: number) {
  return useQuery({
    queryKey: ["jobs", 'detail', jobId],
    queryFn: () => getJob(jobId),
    enabled: jobId > 0,
  })
}

export function useCreateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      })
    },
  })
}

type UpdateJobVariables = {
  jobId: number
  input: UpdateJobInput
}
export function useUpdateJob() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ jobId, input }: UpdateJobVariables) =>
      updateJob(jobId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      })
    },
  })
}

export function useDeleteJob() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteJob,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["jobs"],
      })
    },
  })
}
