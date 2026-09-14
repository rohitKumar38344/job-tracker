import { DashboardLayout } from "@/layouts/DashboardLayout"
import DashboardPage from "@/pages/DashboardPage"
import CompaniesPage from "@/pages/CompaniesPage"
import ApplicationsPage from "@/pages/ApplicationsPage"
import InterviewsPage from "@/pages/InterviewsPage"
import { createBrowserRouter, Navigate } from "react-router"
import JobsPage from "@/pages/JobsPage"
import LoginPage from "@/pages/LoginPage"
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute"
import { RegisterPage } from "@/features/auth/pages/RegisterPage"

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "companies",
            element: <CompaniesPage />,
          },
          {
            path: "jobs",
            element: <JobsPage />,
          },
          {
            path: "applications",
            element: <ApplicationsPage />,
          },
          {
            path: "interviews",
            element: <InterviewsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
])
