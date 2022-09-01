import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";

export default {
  root: "cdn-iife",
  base: "/cdn-iife/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [
    vue(),
    // 打包时在index.html模板中注入全局脚本
    createHtmlPlugin({
      inject: {
        data: {
          cdnScript:
            process.env.NODE_ENV === "production"
              ? '<script src="https://unpkg.com/vue@3"></script>'
              : "",
        },
      },
    }),
  ],
  server: {
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      external: ["vue"],
      output: {
        // 指定打包iife格式
        format: "iife",
        globals: {
          // iife中将传入全局变量Vue，作为vue模块（代码中import的vue）
          vue: "Vue",
        },
      },
    },
  },
};
