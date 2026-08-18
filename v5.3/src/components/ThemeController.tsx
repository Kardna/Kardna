import { useEffect } from "react";
import { useProfile } from "../context/ProfileContext";

export function ThemeController() {
  const { profile } = useProfile();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", "#ffffff");
    root.dataset.theme = profile.settings.theme;
    root.classList.toggle("reduce-motion", profile.settings.reducedMotion);
    root.classList.toggle("low-performance", profile.settings.lowPerformance);
    root.classList.toggle("glass-enabled", profile.settings.liquidGlass && !profile.settings.lowPerformance);
    root.dataset.density = profile.settings.gridDensity;
    root.classList.toggle("startup-disabled", !profile.settings.startupAnimation);
  }, [profile.settings]);

  return null;
}
