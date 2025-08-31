import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import dotenv from "dotenv"; // <-- Import dotenv

dotenv.config(); // <-- Force load .env

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
     headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups', // This might fix the issue
      'Cross-Origin-Embedder-Policy': 'unsafe-none', // You may also need this
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
