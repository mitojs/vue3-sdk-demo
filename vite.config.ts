import type { UserConfig, ConfigEnv } from "vite";
import { resolve } from "path";
import vue from "@vitejs/plugin-vue";
import htmlPlugin from "vite-plugin-html-config";
import type { Options } from "vite-plugin-html-config";

const htmlPluginOpt: Options = {
  metas: [
    {
      name: "keywords",
      content: "mitojs vue3-sdk-demo",
    },
    {
      name: "description",
      content: "mitojs vue3-sdk-demo",
    },
  ],
};
function pathResolve(dir: string) {
  return resolve(process.cwd(), ".", dir);
}

export default ({ command, mode }: ConfigEnv): UserConfig => {
  return {
    base: "/",
    esbuild: {},
    resolve: {
      alias: [
        {
          find: /\/#\//,
          replacement: pathResolve("types") + "/",
        },
        {
          find: "@",
          replacement: pathResolve("src") + "/",
        },
      ],
      dedupe: ["vue"],
    },
    plugins: [vue(), htmlPlugin(htmlPluginOpt)],
    server: {
      host: true,
      port: 8001,
    },
    build: {
      target: "es2015",
      outDir: "dist",
      terserOptions: {
        compress: {
          keep_infinity: true,
          drop_console: true,
        },
      },
      brotliSize: false,
      chunkSizeWarningLimit: 2000,
    },
  };
};
