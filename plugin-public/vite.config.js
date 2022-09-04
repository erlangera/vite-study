import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import assetsPublic from "./src/plugins/vite-plugin-assets-public.js";

export default {
  root: "plugin-public",
  base: "/plugin-public/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    assetsPublic({
      // public目录
      dir: "src/assets-public",
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
};
