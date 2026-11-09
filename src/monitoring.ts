import { init } from "@mitojs/browser";
import { vuePlugin } from "@mitojs/vue";
import type { App } from "vue";
import { apiURL } from "./mock";
import { state } from "./state";

export let monitoring: ReturnType<typeof init>;

export function initializeMonitoring(app: App) {
  monitoring = init(
    {
      apikey: "mitojs-vue3-demo",
      dsn: `${apiURL}report`,
      vue: app,
      maxBreadcrumbs: 50,
      maxDuplicateCount: 100,
      throttleDelayTime: 0,
      silentConsole: true,
      beforePushBreadcrumb(breadcrumb, entry) {
        state.breadcrumbs = [...breadcrumb.getStack(), entry].slice(-50);
        return entry;
      },
    },
    [vuePlugin],
  );
}
