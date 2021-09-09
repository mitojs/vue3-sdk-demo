import { createApp } from "vue";
import App from "./App.vue";

async function bootstrap() {
  const app = createApp(App);
  app.mount("#app", true);
}

void bootstrap();
