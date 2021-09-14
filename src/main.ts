import { createApp } from "vue";
import App from "./App.vue";
import MITO from "@mitojs/vue";

async function bootstrap() {
  const app = createApp(App);

  MITO.init({
    apikey: "abc-123",
    dsn: "/upload",
    maxBreadcrumbs: 100,
    debug: true,
    silentConsole: true,
    enableTraceId: true,
    includeHttpUrlTraceIdRegExp: /.*/,
  });
  app.mount("#app", true);
}

void bootstrap();
