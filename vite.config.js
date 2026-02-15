import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// If you deploy to GitHub Pages at /REPO_NAME/ set base: "/REPO_NAME/"
export default defineConfig({
  plugins: [react()],
  base: "./"
});
