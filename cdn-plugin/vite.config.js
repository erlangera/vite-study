import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";
import { createHtmlPlugin } from "vite-plugin-html";
import externalGlobals from "rollup-plugin-external-globals";

export default {
  root: "cdn-plugin",
  base: "/cdn-plugin/",
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
    // 打包时使用全局变量替换
    // 本方案有诸多问题，如无法正常解析部分css文件（见main.js例子），不推荐使用
    {
      ...externalGlobals({
        vue: "Vue",
      }),
      apply: "build",
    },
  ],
  server: {
    host: "0.0.0.0",
  },
};
