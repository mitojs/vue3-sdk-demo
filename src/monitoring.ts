import { init } from "@mitojs/browser";
import { vuePlugin } from "@mitojs/vue";
import type { App } from "vue";
import { apiURL } from "./mock";
import { state, type Payload } from "./state";

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
        const data = entry.data as Payload["data"];
        const status = data?.response?.status;
        if (
          entry.category === "http" && data?.type === "HTTP" &&
          (data.request?.httpType === "fetch" || data.request?.httpType === "xhr") &&
          typeof status === "number" && status >= 200 && status < 400
        ) {
          // The SDK reports errors itself; include its successful captures in this demo too.
          queueMicrotask(() => {
            void monitoring.transport.send(data, breadcrumb.getStack().slice());
          });
        }
        return entry;
      },
    },
    [vuePlugin],
  );
}
