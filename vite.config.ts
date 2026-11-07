import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  base: "/vue3-sdk-demo/",
  plugins: [vue()],
  build: { target: "es2022", outDir: "docs", emptyOutDir: true },
});
