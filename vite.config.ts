import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";
import vike from "vike/plugin";
import path from "path";

export default defineConfig({
  plugins: [
    vue({
      script: {
        defineModel: true,
      },
    }),
    vike({
      prerender: true,
    }),
  ],
  resolve: {
    alias: {
      "#framework": path.join(__dirname, "renderer"),
      "#design": path.join(__dirname, "design"),
      "~": path.join(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8787",
    },
  },
});
