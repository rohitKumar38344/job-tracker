import { apiClient } from "@/lib/api-client"

interface CompanyApiResponse {
  company_id: number
  company_name: string
  industry: string | null
  location: string | null
  company_size: number | null
  company_url: string | null
  linkedin_url: string | null
  notes: string | null
  created_at: string
  updated_at: string
}
export interface Company {
  companyId: number
  companyName: string
  industry: string | null
  location: string | null
  companySize: number | null
  companyUrl: string | null
  linkedinUrl: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
}

export interface CreateCompanyInput {
  companyName: string
  industry?: string
  location?: string
  companySize?: number
  companyUrl?: string
  linkedinUrl?: string
  notes?: string
}

interface DeleteCompanyApiResponse {
  company_id: number
  company_name: string
}

function mapCompany(company: CompanyApiResponse): Company {
  return {
    companyId: company.company_id,
    companyName: company.company_name,
    industry: company.industry,
    location: company.location,
    companySize: company.company_size,
    companyUrl: company.company_url,
    linkedinUrl: company.linkedin_url,
    notes: company.notes,
    createdAt: company.created_at,
    updatedAt: company.updated_at,
  }
}

export type UpdateCompanyInput = Partial<CreateCompanyInput>

export async function getCompanies() {
  const response = await apiClient<CompanyApiResponse[]>("companies")
  return {
    ...response,
    data: response.data.map(mapCompany),
  }
}

export async function getCompany(companyId: number) {
  const response = await apiClient<CompanyApiResponse>(`companies/${companyId}`)
  return {
    ...response,
    data: mapCompany(response.data),
  }
}

export async function createCompany(input: CreateCompanyInput) {
  const response = await apiClient<CompanyApiResponse>("companies", {
    method: "POST",
    body: JSON.stringify(input),
  })

  return {
    ...response,
    data: mapCompany(response.data),
  }
}

export async function updateCompany(
  companyId: number,
  input: UpdateCompanyInput
) {
  const response = await apiClient<CompanyApiResponse>(
    `companies/${companyId}`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    }
  )
  return {
    ...response,
    data: mapCompany(response.data),
  }
}



export async function deleteCompany(companyId: number) {
  const response = await apiClient<DeleteCompanyApiResponse>(
    `companies/${companyId}`,
    {
      method: "DELETE",
    }
  )
  return {
    ...response,
    data: {
      companyId: response.data.company_id,
      companyName: response.data.company_name
    }
  }
}
