"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/sidebar/SideBar";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const hideSidebar = pathname === "/login";

  return (
    <div className="flex min-h-screen bg-white text-[#121416]">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 max-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
