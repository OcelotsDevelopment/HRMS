import { useSidebarStore } from "../store/useSidebarStore";

const Backdrop: React.FC = () => {

  const toggleMobileSidebar = useSidebarStore((s) => s.toggleMobileSidebar);
  const isMobileOpen = useSidebarStore((s) => s.isMobileOpen);

  if (!isMobileOpen) return null;

  return (
    <div
      className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden"
      onClick={toggleMobileSidebar}
    />
  );
};

export default Backdrop;
