import { defineConfig } from "vite";
import { loadEnv } from "vite";
import { cwd } from "node:process";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), "");
  const backendTarget = env.VITE_DEV_PROXY_TARGET || "http://localhost:3001";

  return {
    plugins: [react(), tailwindcss(), babel({ presets: [reactCompilerPreset()] })],
    server: {
      proxy: {
        "/api": backendTarget,
        "/socket.io": {
          target: backendTarget,
          ws: true,
        },
      },
    },
  };
});
