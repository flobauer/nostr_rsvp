import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      src: "/src",
      pages: "/src/pages",
      components: "/src/components",
      helpers: "/src/helpers",
      assets: "/src/assets",
    },
  },
  plugins: [react()],
});
