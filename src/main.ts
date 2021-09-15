import { createApp } from "vue";
import App from "./App.vue";
import { init } from "@mitojs/vue";
import router, { setupRouter } from "./router";
async function bootstrap() {
  const app = createApp(App);

  const MitoInstance = init({
    apikey: "abc-123",
    dsn: "/upload",
    maxBreadcrumbs: 100,
    debug: true,
    silentConsole: true,
    enableTraceId: true,
    includeHttpUrlTraceIdRegExp: /.*/,
  });
  (window as any).MitoInstance = MitoInstance;
  // 挂载路由
  await setupRouter(app);

  // 路由准备就绪后挂载APP实例
  await router.isReady();

  app.mount("#app", true);
}

void bootstrap();
