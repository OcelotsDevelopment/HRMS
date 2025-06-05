// src/store/useSidebarStore.ts
import { create } from 'zustand';

type SidebarState = {
  isExpanded: boolean;
  isMobileOpen: boolean;
  isHovered: boolean;
  activeItem: string | null;
  openSubmenu: string | null;
  isMobile: boolean;

  toggleSidebar: () => void;
  toggleMobileSidebar: () => void;
  setIsHovered: (isHovered: boolean) => void;
  setActiveItem: (item: string | null) => void;
  toggleSubmenu: (item: string) => void;
  setIsMobile: (isMobile: boolean) => void;
};

export const useSidebarStore = create<SidebarState>((set) => ({
  isExpanded: true,
  isMobileOpen: false,
  isHovered: false,
  activeItem: null,
  openSubmenu: null,
  isMobile: false,

  toggleSidebar: () => set((s) => ({ isExpanded: !s.isExpanded })),
  toggleMobileSidebar: () => set((s) => ({ isMobileOpen: !s.isMobileOpen })),
  setIsHovered: (isHovered) => set({ isHovered }),
  setActiveItem: (item) => set({ activeItem: item }),
  toggleSubmenu: (item) =>
    set((s) => ({
      openSubmenu: s.openSubmenu === item ? null : item,
    })),
  setIsMobile: (isMobile) => set((s) => ({
    isMobile,
    isMobileOpen: isMobile ? s.isMobileOpen : false
  })),
}));