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
    vike({ prerender: { partial: true } }),
  ],
  resolve: {
    alias: {
      "#lib": path.join(__dirname, "lib"),
      "~": path.join(__dirname, "src"),
    },
  },
  server: {
    proxy: {
      "/api": "http://127.0.0.1:8787",
    },
  },
});
