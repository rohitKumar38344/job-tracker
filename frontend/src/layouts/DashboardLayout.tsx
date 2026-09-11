import { Outlet } from "react-router";

import { Sidebar } from "../components/layout/Sidebar";
import { Topbar } from "../components/layout/Topbar";

export const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-7xl p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};