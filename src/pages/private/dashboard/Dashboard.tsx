import { useState } from "react";
import { Outlet } from "react-router-dom";
import ToolBar from "../../../components/Sidebar/Toolbar";

export default function Dashboard() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="h-dvh flex overflow-hidden bg-[#EEF7FF] dark:bg-black">
      <aside className="shrink-0 h-full">
        <ToolBar
          collapsed={sidebarCollapsed}
          onCollapsedChange={setSidebarCollapsed}
        />
      </aside>

      <main className="min-w-0 flex-1 h-full overflow-y-auto p-6 md:p-10 text-[#4D869C] dark:text-white">
        <Outlet />
      </main>
    </div>
  );
}