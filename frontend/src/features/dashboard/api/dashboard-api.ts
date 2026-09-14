import { apiClient } from "@/lib/api-client"
import type { ApplicationStatus } from "@/features/applications/api/applications-api"

export interface DashboardStats { totalJobs: number; totalApplications: number; totalInterviews: number; applicationsByStatus: Record<ApplicationStatus, number> }
export async function getDashboardStats() { const response = await apiClient<DashboardStats>("dashboard"); return response.data }
