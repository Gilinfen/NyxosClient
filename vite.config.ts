import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite";

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [reactRouter()],

  // Vite选项为Tauri开发量身定制，仅在`tauri dev`或`tauri build`时应用
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421,
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"],
    },
  },
});
