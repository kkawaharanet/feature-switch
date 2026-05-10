import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  manifest: {
    name: "__MSG_applicationName__",
    version: "1.0.0",
    description: "__MSG_description__",
    default_locale: "ja",
    permissions: [
      "contentSettings", // 機能の切り替えに必要
      "storage", // 設定の保存に必要
    ],
  },
});
