import { Outlet } from "react-router-dom";

import { Header } from "@/components/layout/Header";
import { MobileNav } from "@/components/layout/MobileNav";
import { Sidebar } from "@/components/layout/Sidebar";

export function AppShell() {
  return (
    <div className="ambient-field min-h-screen overflow-x-hidden bg-paper text-foreground">
      <div className="relative z-10 flex min-h-screen">
        <Sidebar />
        <main className="min-w-0 flex-1 px-4 pb-24 pt-5 sm:px-7 lg:px-9 lg:pb-10 lg:pt-8">
          <Header />
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
