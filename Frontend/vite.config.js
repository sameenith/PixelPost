// import { defineConfig , loadEnv} from "vite";
// import react from "@vitejs/plugin-react";
// import tailwindcss from "@tailwindcss/vite";
// import path from "path";

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react(), tailwindcss()],
//   resolve: {
//     alias: {
//       "@": path.resolve(__dirname, "./src"), // This line is the important one
//     },
//   },
//   server: {
//     proxy: {
//       // String shorthand: '/api' -> 'http://localhost:8000/api'
//       "/api": {
//         target: env.URL,
//         changeOrigin: true,
//       },
//     },
//   },
// });


import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
// 🚀 CRITICAL FIX: Wrap defineConfig in a function that receives the context (mode)
export default defineConfig(({ mode }) => {
    
    // 1. Define 'env' by calling loadEnv inside the function scope
    const env = loadEnv(mode, process.cwd(), '');
    
    return {
        plugins: [react(), tailwindcss()],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "./src"),
            },
        },
        server: {
            proxy: {
                // String shorthand: '/api' -> 'http://localhost:8000/api'
                "/api": {
                    // 2. Use the defined 'env.URL' variable
                    target: env.URL,
                    changeOrigin: true,
                },
            },
        },
    };
});