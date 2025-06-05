import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "swiper/swiper-bundle.css";
import { useThemeStore } from "../src/store/useThemeStore.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import "./index.css";


// Small component to initialize theme from localStorage
function ThemeInitializer() {
  const initTheme = useThemeStore((state) => state.initTheme);

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return null;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppWrapper>
      <ThemeInitializer />
      <App />
    </AppWrapper>
  </StrictMode>
);
