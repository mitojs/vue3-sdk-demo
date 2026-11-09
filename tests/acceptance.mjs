import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { preview } from "vite";
import { chromium, expect } from "@playwright/test";
const server = process.env.BASE_URL
  ? undefined
  : await preview({
      preview: { host: "127.0.0.1", port: 2035, strictPort: true },
    });
const baseURL = process.env.BASE_URL || "http://localhost:2035/vue3-sdk-demo/";
const evidence = resolve(".cache/validation");
await mkdir(evidence, { recursive: true });
let browser;
let page;
const result = { baseURL, reports: {}, externalRequests: [], passed: false };
try {
  browser = await chromium.launch({ headless: true, channel: "chromium" });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    serviceWorkers: "allow",
  });
  context.on("request", (request) => {
    if (new URL(request.url()).origin !== new URL(baseURL).origin)
      result.externalRequests.push(request.url());
  });
  page = await context.newPage();
  const uploads = [];
  page.on("request", (request) => {
    if (request.method() === "POST" && request.url() === new URL("api/report", baseURL).href)
      uploads.push(request.postDataJSON());
  });
  await page.goto(baseURL);
  await expect(
    page.getByRole("heading", { name: "Vue 3 SDK 演示", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("本地接收已就绪", { exact: true })).toBeVisible();
  await expect(page.getByText("还没有上报记录", { exact: true })).toBeVisible();

  // Removing the SDK call, Vue plugin, rejection listener or HTTP interception must fail these payload assertions.
  async function reportAfter(button, predicate) {
    const [request] = await Promise.all([
      page.waitForRequest(
        (request) =>
          request.method() === "POST" &&
          request.url() === new URL("api/report", baseURL).href &&
          predicate(request.postDataJSON()),
      ),
      page.getByRole("button", { name: button, exact: true }).click(),
    ]);
    const payload = request.postDataJSON();
    assert.equal(payload.authInfo.sdkVersion, "4.0.0");
    assert.equal(payload.authInfo.sdkName, "mitojs");
    assert.equal((await request.response()).status(), 200);
    assert.ok(payload.breadcrumb.length > 0);
    await expect(
      page.getByTestId("report-list").getByRole("button").first(),
    ).toBeVisible();
    await expect(
      page.getByTestId("report-list").getByRole("button").first(),
    ).toHaveAttribute("aria-pressed", "true");
    return payload;
  }
  async function expectHttpColors(row, successful) {
    const colors = await row.evaluate((element) => {
      const badge = getComputedStyle(element.querySelector(".report-monitor__type"));
      const status = getComputedStyle(element.querySelector(".report-monitor__status"));
      return { badge: badge.color, background: badge.backgroundColor, status: status.color };
    });
    colors.detailStatus = await page.getByTestId("report-detail").locator(".report-monitor__status")
      .evaluate((element) => getComputedStyle(element).color);
    for (const [part, color] of Object.entries(colors)) {
      const [red, green, blue] = color.match(/\d+/g).map(Number);
      assert.ok(successful ? green > red && green > blue : red > green && red > blue,
        `${part} should be ${successful ? "green" : "red"} for HTTP ${successful ? 200 : 500}, got ${color}`);
    }
  }
  result.reports.manual = await reportAfter(
    "手动上报",
    (data) => data.data.type === "LOG",
  );
  assert.equal(result.reports.manual.data.customTag, "vue3-demo");
  await expect(page.getByTestId("report-detail")).toContainText("sdkVersion");
  result.reports.vue = await reportAfter(
    "Vue 组件错误",
    (data) => data.data.type === "VUE",
  );
  assert.match(result.reports.vue.data.message, /Vue 组件演示错误/);
  assert.match(result.reports.vue.data.componentName, /VueErrorDemo/);
  await expect(page.getByRole("status")).toContainText(
    "组件错误已采集，页面可以继续操作。",
  );
  result.reports.promise = await reportAfter(
    "Promise 异常",
    (data) => data.data.type === "PROMISE",
  );
  assert.match(result.reports.promise.data.message, /Promise 演示异常/);
  result.reports.fetch = await reportAfter(
    "异常 Fetch",
    (data) => data.data.type === "HTTP",
  );
  assert.equal(result.reports.fetch.data.response.status, 500);
  result.reports.xhr = await reportAfter(
    "异常 XHR",
    (data) => data.data.type === "HTTP" && data.data.request.httpType === "xhr",
  );
  assert.equal(result.reports.xhr.data.response.status, 500);
  result.reports.code = await reportAfter(
    "JavaScript 异常",
    (data) => data.data.type === "JAVASCRIPT",
  );
  assert.match(result.reports.code.data.message, /JavaScript 演示异常/);
  // Hiding HTTP status/source/duration, searching embedded breadcrumbs, or
  // replacing individual report selection with a grouped record breaks these checks.
  const reportRows = page.getByTestId("report-list").getByRole("button");
  await expect(reportRows).toHaveCount(6);
  const httpRows = reportRows.filter({ hasText: "GET /api/failure" });
  await expect(httpRows).toHaveCount(2);
  await expect(httpRows.first()).toContainText("500");
  await expect(httpRows.filter({ hasText: "Fetch" }).locator(".report-monitor__duration")).toHaveText(`${result.reports.fetch.data.elapsedTime} ms`);
  await expect(httpRows.filter({ hasText: "XHR" }).locator(".report-monitor__duration")).toHaveText(`${result.reports.xhr.data.elapsedTime} ms`);
  await expect(httpRows.filter({ hasText: "Fetch" })).toHaveCount(1);
  await expect(httpRows.filter({ hasText: "XHR" })).toHaveCount(1);
  for (const source of ["Fetch", "XHR"]) {
    const row = httpRows.filter({ hasText: source });
    await row.click();
    await expectHttpColors(row, false);
  }
  await page.screenshot({ path: resolve(evidence, "http-error.png"), fullPage: true });
  await expect(reportRows.filter({ hasText: "VueErrorDemo" })).toHaveCount(1);
  await expect(reportRows.filter({ hasText: "vue3-demo" })).toHaveCount(1);
  await expect(reportRows.filter({ hasText: "JavaScript 演示异常" })).toContainText(/index-[\w-]+\.js:\d+:\d+/);
  await expect(reportRows.filter({ hasText: "Promise 演示异常" })).toContainText(/index-[\w-]+\.js:\d+:\d+/);
  await reportRows.filter({ hasText: "JavaScript 演示异常" }).click();
  await expect(page.getByTestId("report-detail").locator("dl")).toContainText(result.reports.code.data.stack[0].url);
  const search = page.getByRole("textbox", { name: "搜索采集结果" });
  for (const query of ["HTTP", "500", "/api/failure"]) {
    await search.fill(query);
    await expect(reportRows).toHaveCount(2);
  }
  await search.fill("Fetch");
  await expect(reportRows).toHaveCount(1);
  await reportRows.first().click();
  await expect(page.getByTestId("report-detail")).toContainText("本地演示服务暂不可用");
  await expect(page.getByTestId("report-detail")).toContainText("fetch--GET");
  const rawJSON = page.getByTestId("report-json");
  await expect(rawJSON).not.toBeVisible();
  await page.getByText("完整上报 JSON", { exact: true }).click();
  await expect(rawJSON).toBeVisible();
  await expect(rawJSON).toContainText('"sdkVersion": "4.0.0"');
  await expect(rawJSON).toContainText('"breadcrumb":');
  await page.getByText("完整上报 JSON", { exact: true }).click();
  await search.fill("XHR");
  await expect(reportRows).toHaveCount(1);
  await reportRows.first().click();
  await expect(page.getByTestId("report-detail")).toContainText("xhr--GET");
  await search.fill("vue3-demo");
  await expect(reportRows).toHaveCount(1);
  await expect(page.getByTestId("report-detail")).toContainText("Mito.log");
  await search.fill("");
  await httpRows.filter({ hasText: "Fetch" }).click();
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, "Dense desktop report panel fits");
  await page.screenshot({ path: resolve(evidence, "desktop-reports.png"), fullPage: true });
  await page.getByRole("textbox", { name: "搜索采集结果" }).fill("Promise");
  await expect(page.getByTestId("report-list").getByRole("button")).toHaveCount(
    1,
  );
  await page
    .getByRole("textbox", { name: "搜索采集结果" })
    .fill("__missing_event__");
  await expect(
    page.getByText("没有找到匹配的上报。", { exact: true }),
  ).toBeVisible();
  await page.getByRole("textbox", { name: "搜索采集结果" }).fill("");
  await page.getByTestId("report-list").getByRole("button").last().click();
  await expect(page.getByTestId("report-detail")).toContainText(
    "vue3-demo",
  );
  // Dropping successful HTTP captures must fail on the missing real SDK POST,
  // even when the request itself succeeds and the notice is displayed.
  for (const [key, button, httpType, rowCount] of [
    ["fetchSuccess", "正常 Fetch", "fetch", 7],
    ["xhrSuccess", "正常 XHR", "xhr", 8],
  ]) {
    const payload = await reportAfter(
      button,
      (data) => data.data.type === "HTTP" &&
        data.data.request.httpType === httpType &&
        data.data.request.url === new URL("api/success", baseURL).href &&
        data.data.response.status === 200,
    );
    result.reports[key] = payload;
    assert.equal(payload.data.request.method, "GET");
    assert.equal(payload.data.request.httpType, httpType);
    assert.equal(payload.data.response.status, 200);
    await expect(reportRows).toHaveCount(rowCount);
    const successRow = reportRows.filter({ hasText: "GET /api/success" }).filter({ hasText: httpType === "fetch" ? "Fetch" : "XHR" });
    await expect(successRow).toHaveCount(1);
    await expect(successRow).toHaveAttribute("aria-pressed", "true");
    await expect(successRow.locator(".report-monitor__status")).toHaveText("200");
    await expectHttpColors(successRow, true);
    await expect(successRow.locator(".report-monitor__duration")).toHaveText(`${payload.data.elapsedTime} ms`);
    await expect(page.getByTestId("report-detail")).toContainText("本地演示请求已完成");
    await page.getByText("完整上报 JSON", { exact: true }).click();
    assert.deepEqual(JSON.parse(await rawJSON.textContent()), payload);
    await page.getByText("完整上报 JSON", { exact: true }).click();
  }
  await page.screenshot({ path: resolve(evidence, "http-success.png"), fullPage: true });
  for (const httpType of ["fetch", "xhr"]) {
    for (const status of [200, 500]) {
      assert.equal(uploads.filter((payload) => payload.data.type === "HTTP" &&
        payload.data.request.httpType === httpType && payload.data.response.status === status).length, 1);
    }
  }
  assert.equal(uploads.length, 8, "Successful requests and errors each upload once without capturing the report endpoint");
  await page.getByRole("button", { name: "增加计数", exact: true }).click();
  await expect(page.getByTestId("counter")).toHaveText("1");
  await page
    .getByRole("button", { name: "行为轨迹", exact: true })
    .first()
    .click();
  await expect(page).toHaveURL(/#\/behavior$/);
  await expect(
    page.getByRole("heading", {
      name: "每一步操作，都有迹可循。",
      exact: true,
    }),
  ).toBeVisible();
  await expect(page.getByTestId("breadcrumb-list")).toContainText("Click");
  await page.getByRole("button", { name: "清空记录", exact: true }).click();
  await expect(page.getByTestId("breadcrumb-list")).toContainText(
    "试着点击一个按钮，行为会出现在这里。",
  );
  await page.getByRole("button", { name: "增加计数", exact: true }).click();
  await expect(page.getByTestId("breadcrumb-list")).toContainText("Click");
  await page.reload();
  await expect(
    page.getByRole("heading", {
      name: "每一步操作，都有迹可循。",
      exact: true,
    }),
  ).toBeVisible();
  await page.getByRole("button", { name: "异常演示", exact: true }).click();
  await page.getByRole("button", { name: "手动上报", exact: true }).click();
  await expect(
    page.getByTestId("report-list").getByRole("button").first(),
  ).toBeVisible();
  await page.screenshot({
    path: resolve(evidence, "desktop.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "清空记录", exact: true }).click();
  await expect(page.getByText("还没有上报记录", { exact: true })).toBeVisible();
  for (const width of [390, 768]) {
    const mobilePage = await context.newPage();
    await mobilePage.setViewportSize({ width, height: 844 });
    await mobilePage.goto(baseURL);
    await expect(
      mobilePage.getByRole("button", { name: "手动上报", exact: true }),
    ).toBeVisible();
    await mobilePage
      .getByRole("button", { name: "手动上报", exact: true })
      .click();
    await expect(mobilePage.getByTestId("report-detail")).toContainText(
      "sdkVersion",
    );
    const [httpRequest] = await Promise.all([
      mobilePage.waitForRequest((request) => request.method() === "POST" && request.url() === new URL("api/report", baseURL).href && request.postDataJSON().data.type === "HTTP"),
      mobilePage.getByRole("button", { name: "异常 Fetch", exact: true }).click(),
    ]);
    assert.equal((await httpRequest.response()).status(), 200);
    await expect(mobilePage.getByTestId("report-detail")).toContainText("fetch--GET");
    assert.equal(
      await mobilePage.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      true,
      `No horizontal overflow at ${width}px`,
    );
    await mobilePage.getByText("完整上报 JSON", { exact: true }).click();
    await expect(mobilePage.getByTestId("report-json")).toBeVisible();
    assert.equal(await mobilePage.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), true, `Expanded payload fits at ${width}px`);
    await mobilePage.getByText("完整上报 JSON", { exact: true }).click();
    await mobilePage.screenshot({
      path: resolve(evidence, `viewport-${width}.png`),
      fullPage: true,
    });
    await mobilePage.close();
  }
  assert.deepEqual(result.externalRequests, []);
  result.passed = true;
  console.log(
    "PASS: production page, real SDK payloads (LOG/VUE/PROMISE/HTTP/JAVASCRIPT), local delivery, navigation, clear and responsive layout",
  );
} catch (error) {
  result.error = String(error);
  await page
    ?.screenshot({ path: resolve(evidence, "failure.png"), fullPage: true })
    .catch(() => {});
  throw error;
} finally {
  await writeFile(
    resolve(evidence, "results.json"),
    JSON.stringify(result, null, 2),
  );
  await browser?.close();
  if (server) await new Promise((resolve) => server.httpServer.close(resolve));
}
