import { createApp } from "vue";
import App from "./App.vue";
import { initializeMonitoring } from "./monitoring";
import { startLocalReceiver } from "./mock";
import "./style.css";

async function bootstrap() {
  await startLocalReceiver();
  const app = createApp(App);
  initializeMonitoring(app);
  app.mount("#app");
}

void bootstrap().catch(() => {
  const root = document.querySelector("#app");
  if (root) {
    root.textContent =
      "本地演示暂未就绪，请允许此页面使用 Service Worker，然后刷新重试。";
  }
});
