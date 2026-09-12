import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import { router } from "./app/router"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { RouterProvider } from "react-router"
import { QueryClientProvider } from "@tanstack/react-query"
import { queryClient } from "./app/query-client"
import { AuthProvider } from "./features/auth/context/auth-context"

createRoot(document.getElementById("root")!).render(
   <StrictMode>
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
   </StrictMode>
)
