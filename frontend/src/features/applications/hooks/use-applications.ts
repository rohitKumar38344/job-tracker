import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createApplication, deleteApplication, getApplications, updateApplication, type ApplicationInput, type ApplicationStatus } from "../api/applications-api"

export const applicationsQueryKey = ["applications"]

export function useApplications(status?: ApplicationStatus) {
  return useQuery({ queryKey: [...applicationsQueryKey, status], queryFn: () => getApplications(status) })
}

export function useCreateApplication() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: (input: ApplicationInput) => createApplication(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsQueryKey }) })
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: ({ applicationId, input }: { applicationId: number; input: Parameters<typeof updateApplication>[1] }) => updateApplication(applicationId, input), onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsQueryKey }) })
}

export function useDeleteApplication() {
  const queryClient = useQueryClient()
  return useMutation({ mutationFn: deleteApplication, onSuccess: () => queryClient.invalidateQueries({ queryKey: applicationsQueryKey }) })
}
