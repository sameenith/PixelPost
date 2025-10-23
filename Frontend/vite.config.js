import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // This line is the important one
    },
  },
  server: {
    proxy: {
      // String shorthand: '/api' -> 'http://localhost:8000/api'
      "/api": {
        target: process.env.URL,
        changeOrigin: true,
      },
    },
  },
});
