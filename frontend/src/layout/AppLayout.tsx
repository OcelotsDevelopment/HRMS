// src/layout/AppLayout.tsx
import { useEffect } from 'react';
import { useSidebarStore } from '../store/useSidebarStore';
import LayoutContent from "./LayoutContent.tsx";

function AppLayout() {
  const setIsMobile = useSidebarStore((state) => state.setIsMobile);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setIsMobile]);

  return (
    <LayoutContent />
  );
}

export default AppLayout;