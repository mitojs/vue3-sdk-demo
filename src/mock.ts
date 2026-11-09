import { http, HttpResponse } from "msw";
import { setupWorker } from "msw/browser";
import { receiveReport } from "./state";
import type { Payload } from "./state";

export const apiURL = new URL(
  `${import.meta.env.BASE_URL}api/`,
  window.location.origin,
).href;
const worker = setupWorker(
  http.post(`${apiURL}report`, async ({ request }) => {
    receiveReport((await request.json()) as Payload);
    return HttpResponse.json({ received: true });
  }),
  http.get(`${apiURL}success`, () =>
    HttpResponse.json({ message: "本地演示请求已完成" }),
  ),
  http.get(`${apiURL}failure`, () =>
    HttpResponse.json({ message: "本地演示服务暂不可用" }, { status: 500 }),
  ),
);

export async function startLocalReceiver() {
  await worker.start({
    serviceWorker: { url: `${import.meta.env.BASE_URL}mockServiceWorker.js` },
    onUnhandledFrame: "bypass",
    quiet: true,
  });
}
