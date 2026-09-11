import {
  Briefcase,
  Building2,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { NavLink } from "react-router";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Companies",
    path: "/companies",
    icon: Building2,
  },
  {
    label: "Jobs",
    path: "/jobs",
    icon: Briefcase,
  },
  {
    label: "Applications",
    path: "/applications",
    icon: FileText,
  },
  {
    label: "Interviews",
    path: "/interviews",
    icon: CalendarDays,
  },
];

export const Sidebar = () => {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r bg-card">
      {/* Brand */}
      <div className="flex h-16 items-center px-6">
        <span className="text-lg font-semibold tracking-tight">
          Job Tracker
        </span>
      </div>

      <Separator />

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 p-4">
        <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Main
        </p>

        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`
              }
            >
              <Icon className="size-5 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 text-muted-foreground hover:text-foreground"
        >
          <LogOut className="size-5" />
          <span>Logout</span>
        </Button>
      </div>
    </aside>
  );
};