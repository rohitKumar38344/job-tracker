import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  createCompany,
  deleteCompany,
  getCompanies,
  updateCompany,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from "../api/companies-api"

export const companiesQueryKey = ["companies"]

export function useCompanies() {
  return useQuery({
    queryKey: companiesQueryKey,
    queryFn: getCompanies,
  })
}

export function useCreateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateCompanyInput) => createCompany(input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companiesQueryKey,
      })
    },
  })
}

export function useUpdateCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      companyId,
      input,
    }: {
      companyId: number
      input: UpdateCompanyInput
    }) => updateCompany(companyId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companiesQueryKey,
      })
    },
  })
}

export function useDeleteCompany(){
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (companyId: number) => deleteCompany(companyId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: companiesQueryKey
      })
    }
  })
}
