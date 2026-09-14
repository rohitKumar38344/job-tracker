import { Bell } from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLocation, useNavigate } from "react-router"
import { useAuth } from "@/features/auth/context/auth-context"
import { getInitials } from "@/lib/get-initials"

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/companies": "Companies",
  "/jobs": "Jobs",
  "/applications": "Applications",
  "/interviews": "Interviews",
}

export const Topbar = () => {
  const { pathname } = useLocation()
  const pageTitle = pageTitles[pathname] ?? "Job Tracker"
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      await logout()
      navigate("/login", { replace: true })
    } catch {
      navigate("/login", { replace: true })
    }
  }
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-6">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold capitalize">{pageTitle}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="flex items-center gap-2 px-2">
                <Avatar className="size-8">
                  <AvatarFallback>
                    {user ? getInitials(user.name) : "?"}
                  </AvatarFallback>
                </Avatar>

                <span className="hidden text-sm font-medium sm:inline">
                  {user?.name}
                </span>
              </Button>
            }
          ></DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Profile</DropdownMenuItem>

            <DropdownMenuItem>Account</DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
