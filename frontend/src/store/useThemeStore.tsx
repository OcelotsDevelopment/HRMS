import { create } from 'zustand';

type Theme = 'light' | 'dark';

type ThemeState = {
  theme: Theme;
  isInitialized: boolean;
  toggleTheme: () => void;
  initTheme: () => void;
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'light',
  isInitialized: false,

  initTheme: () => {
    const savedTheme = (localStorage.getItem("theme") as Theme) || "light";
    set({ theme: savedTheme, isInitialized: true });

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  },

  toggleTheme: () => {
    const currentTheme = get().theme;
    const newTheme = currentTheme === "light" ? "dark" : "light";

    set({ theme: newTheme });
    localStorage.setItem("theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }
}));