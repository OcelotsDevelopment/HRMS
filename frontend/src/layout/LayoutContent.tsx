// src/layout/LayoutContent.tsx
import { Outlet } from "react-router";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import Header from "./Header";
import { useSidebarStore } from "../store/useSidebarStore";

const LayoutContent: React.FC = () => {
  const isExpanded = useSidebarStore((s) => s.isExpanded);
  const isHovered = useSidebarStore((s) => s.isHovered);
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);

  return (
    <div className="min-h-screen xl:flex">
      {/* Sidebar and Backdrop */}
      <div>
        <AppSidebar />
        <Backdrop />
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
        } ${isMobileOpen ? "ml-0" : ""} w-full`}
      >
        <Header />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default LayoutContent;