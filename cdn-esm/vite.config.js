import { fileURLToPath, URL } from "node:url";

import vue from "@vitejs/plugin-vue";

export default {
  root: "cdn-esm",
  base: "/cdn-esm/",
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  plugins: [vue()],
  server: {
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      // 打包时排除vue
      external: ['vue'],
      output: {
        paths: {
          // 将from 'vue'中vue替换为指定路径，这种方式只能使用esm版本的vue模块
          vue: 'https://unpkg.com/vue@3/dist/vue.esm-browser.js'
        }
      }
    }
  }
};
