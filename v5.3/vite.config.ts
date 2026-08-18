import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const requestedBase = env.VITE_BASE_PATH || "/";
  const base = requestedBase.endsWith("/") ? requestedBase : `${requestedBase}/`;

  return {
    base,
    plugins: [react()],
    build: {
      target: "es2022",
      cssCodeSplit: true,
      sourcemap: false,
    },
  };
});
