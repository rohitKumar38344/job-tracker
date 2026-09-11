import { DashboardLayout } from "@/layouts/DashboardLayout"
import DashboardPage from "@/pages/DashboardPage"
import CompaniesPage from "@/pages/CompaniesPage"
import ApplicationsPage from "@/pages/ApplicationsPage"
import InterviewsPage from "@/pages/InterviewsPage"
import { createBrowserRouter } from "react-router"
import JobsPage from "@/pages/JobsPage"

export const router = createBrowserRouter([
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
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
  {
    path: "/login",
    element: <h1>Login</h1>,
  },
  {
    path: "/register",
    element: <h1>Register</h1>,
  },
])
