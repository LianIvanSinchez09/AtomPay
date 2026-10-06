import { useState } from "react";
import { Outlet } from "react-router-dom";
import ToolBar from "../../../components/Sidebar/Toolbar";
import Footer from  "../../../components/Footer.tsx"


export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
      <div className="flex gap-50 min-h-screen bg-[#EEF7FF] dark:bg-black">
        <aside className="shrink-0">
          <ToolBar
            collapsed={sidebarCollapsed}
            onCollapsedChange={setSidebarCollapsed}
          />
        </aside>

        <main
          className="
            min-w-0
            flex-1
            overflow-y-auto
            p-6
            md:p-10
            text-[#4D869C]
            dark:text-white
          "
        >
          <Outlet />
        </main>
      </div>
  );
}
