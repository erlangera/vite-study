import fs from "node:fs";
import path from "node:path";

function copyDir(srcDir, destDir) {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    if (srcFile === destDir) {
      continue;
    }
    const destFile = path.resolve(destDir, file);
    const stat = fs.statSync(srcFile);
    if (stat.isDirectory()) {
      copyDir(srcFile, destFile);
    } else {
      fs.copyFileSync(srcFile, destFile);
    }
  }
}

export default function assetsSwitchPlugin(options) {
  const { dir } = options;
  // 校验与默认值设置
  let resolvedConfig;
  return {
    name: "vite:assets-public",
    configResolved(config) {
      // 存储最终解析的配置
      resolvedConfig = config;
    },
    configureServer(server) {
      server.middlewares.use(function viteServeAssetsPublicMiddleware(
        req,
        res,
        next
      ) {
        // 使用中间件修改路径解决开发模式下请求问题
        // 检测dir下是否有对应文件
        if (req.url.startsWith("/")) {
          // 组装绝对路径
          const abs = path.join(resolvedConfig.root, dir, req.url);
          // abs下存在对应文件则改写url，后续会被staticServe（root目录的文件服务器）处理
          if (fs.existsSync(abs)) {
            req.url = `/${dir}${req.url}`;
          }
        }
        next();
      });
    },
    resolveId(id, importer, options) {
      // 组装绝对路径
      const abs = path.join(resolvedConfig.root, dir, id);
      if (fs.existsSync(abs)) {
        // 检测dir下是否有对应文件，如果有标记ID
        return `\0assets_public${id}`;
      }
    },
    load(id) {
      if (id.startsWith(`\0assets_public/`)) {
        // 如果id被标记返回路径
        return `export default ${JSON.stringify(
          `${resolvedConfig.base || "/"}${id.slice(15)}`
        )}`;
      }
    },
    writeBundle() {
      // 写入时复制文件夹
      copyDir(
        path.join(resolvedConfig.root, dir),
        path.join(resolvedConfig.root, resolvedConfig.build.outDir)
      );
    },
  };
}
