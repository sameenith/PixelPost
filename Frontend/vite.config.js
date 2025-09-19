import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // String shorthand: '/api' -> 'http://localhost:8000/api'
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
