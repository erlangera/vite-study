import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const branch = process.env.npm_config_branch;

export default defineConfig(async () => {
  let config = {
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: [vue()],
    server: {
      host: "0.0.0.0",
    },
  };
  if (branch) {
    const { default: branchConfig } = await import(
      `./${branch}/vite.config.js`
    );
    config = branchConfig;
  }
  return config;
});
