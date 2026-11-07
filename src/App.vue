<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from "vue";
import { monitoring } from "./monitoring";
import { apiURL } from "./mock";
import { clearReports, describeBreadcrumb, formatTime, state } from "./state";
import Icon from "./components/Icon.vue";
import VueErrorDemo from "./components/VueErrorDemo.vue";

const route = ref(
  window.location.hash === "#/behavior" ? "behavior" : "scenarios",
);
const activeTab = ref(route.value === "behavior" ? "breadcrumbs" : "reports");
const count = ref(0);
const search = ref("");
const vueErrorCollected = computed(() =>
  state.reports.some((report) => report.payload.data.type === "VUE"),
);
const selected = computed(() =>
  state.reports.find((report) => report.id === state.selectedId),
);
const filteredReports = computed(() =>
  state.reports.filter((report) =>
    `${report.payload.data.type} ${report.payload.data.message}`
      .toLowerCase()
      .includes(search.value.toLowerCase()),
  ),
);
const crumbs = computed(() =>
  [...state.breadcrumbs]
    .reverse()
    .filter((entry) =>
      `${entry.type} ${describeBreadcrumb(entry)}`
        .toLowerCase()
        .includes(search.value.toLowerCase()),
    ),
);
const isBehavior = computed(() => route.value === "behavior");

function syncRoute() {
  route.value =
    window.location.hash === "#/behavior" ? "behavior" : "scenarios";
  activeTab.value = isBehavior.value ? "breadcrumbs" : "reports";
  search.value = "";
}
function navigate(destination: string) {
  window.location.hash =
    destination === "behavior" ? "/behavior" : "/scenarios";
  syncRoute();
}
onMounted(() => window.addEventListener("hashchange", syncRoute));
onUnmounted(() => window.removeEventListener("hashchange", syncRoute));

function manualReport() {
  monitoring.log({
    message: "这是一条来自 Vue 3 演示的手动上报",
    tag: "vue3-demo",
  });
  state.notice = "手动上报已触发。";
}
function promiseError() {
  void Promise.reject(new Error("Promise 演示异常"));
  state.notice = "Promise 异常已触发。";
}
function codeError() {
  window.setTimeout(() => {
    throw new Error("JavaScript 演示异常");
  }, 0);
  state.notice = "JavaScript 异常已触发。";
}
async function fetchRequest(failure: boolean) {
  try {
    const response = await fetch(`${apiURL}${failure ? "failure" : "success"}`);
    await response.json();
    state.notice = response.ok
      ? "Fetch 请求成功 · HTTP 200"
      : "Fetch 请求异常 · HTTP 500，已自动上报。";
  } catch {
    state.notice = "Fetch 请求未完成，请刷新页面重试。";
  }
}
function xhrRequest(failure: boolean) {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", `${apiURL}${failure ? "failure" : "success"}`);
  xhr.addEventListener("loadend", () => {
    state.notice =
      xhr.status === 200
        ? "XHR 请求成功 · HTTP 200"
        : `XHR 请求异常 · HTTP ${xhr.status}，已自动上报。`;
  });
  xhr.send();
}
function changeCount(delta: number) {
  count.value += delta;
  state.notice = `计数已更新为 ${count.value}，点击行为已记录。`;
}
function switchTab(tab: string) {
  activeTab.value = tab;
  search.value = "";
}

function clearRecords() {
  monitoring.breadcrumb.clear();
  state.breadcrumbs = [];
  clearReports();
  state.notice = "当前会话记录已清空。";
}
</script>

<template>
  <div class="app-shell">
    <aside class="sidebar">
      <a class="brand" href="#/scenarios" aria-label="MitoJS 首页">
        <span class="brand-symbol">m</span
        ><span>mito<span class="brand-light">js</span></span>
      </a>
      <div class="sidebar-content">
        <p class="nav-caption">SDK PLAYGROUND</p>
        <nav aria-label="演示导航">
          <button
            :class="['nav-item', { active: !isBehavior }]"
            :aria-current="!isBehavior ? 'page' : undefined"
            @click="navigate('scenarios')"
          >
            <Icon name="grid" /><span>异常演示</span
            ><Icon name="arrow" class="nav-arrow" />
          </button>
          <button
            :class="['nav-item', { active: isBehavior }]"
            :aria-current="isBehavior ? 'page' : undefined"
            @click="navigate('behavior')"
          >
            <Icon name="activity" /><span>行为轨迹</span
            ><Icon name="arrow" class="nav-arrow" />
          </button>
        </nav>
        <div class="sidebar-footer">
          <span class="vue-dot"></span><span>Vue 3 集成示例</span>
          <p>让前端问题，有迹可循。</p>
        </div>
      </div>
    </aside>

    <div class="workspace">
      <header class="topbar">
        <div class="breadcrumb">
          MitoJS <span>/</span> <strong>Vue 3 演示</strong>
        </div>
        <div class="header-actions">
          <span class="framework-tag">Vue 3</span
          ><a
            href="https://github.com/mitojs/vue3-sdk-demo"
            target="_blank"
            rel="noreferrer"
            class="github-link"
            aria-label="查看 GitHub 源码"
            ><Icon name="github" /><span>GitHub</span
            ><Icon name="link" class="external-icon"
          /></a>
        </div>
      </header>

      <main>
        <div class="page-heading">
          <div>
            <p class="eyebrow">OBSERVE. UNDERSTAND. IMPROVE.</p>
            <h1>Vue 3 SDK 演示</h1>
            <p class="page-description">
              从一次点击开始，体验前端监控的完整过程。
            </p>
          </div>
          <span class="ready-indicator"><i></i>本地接收已就绪</span>
        </div>
        <div class="info-banner">
          <Icon name="info" />
          <div>
            <strong>点击左侧场景，实时查看采集结果</strong>
            <p>
              异常会自动生成上报记录，日常操作会留在行为轨迹中。所有演示数据仅在当前浏览器内接收。
            </p>
          </div>
          <span class="banner-badge">实时采集</span>
        </div>
        <div class="section-intro">
          <div>
            <h2>
              {{ isBehavior ? "每一步操作，都有迹可循。" : "试着触发一个场景" }}
            </h2>
            <p>
              {{
                isBehavior
                  ? "还原异常发生前的点击、请求与页面跳转。"
                  : "选择一种异常，右侧即刻呈现完整上报。"
              }}
            </p>
          </div>
          <span class="section-count"
            >{{ state.reports.length }} 条上报 <span>·</span>
            {{ state.breadcrumbs.length }} 个行为</span
          >
        </div>

        <div class="demo-grid">
          <section class="controls-column" aria-label="场景操作">
            <article class="card counter-card">
              <div class="card-label">
                <Icon name="activity" /><span>交互计数器</span
                ><span class="tiny-tag">DOM</span>
              </div>
              <div class="counter-controls">
                <div>
                  <strong data-testid="counter">{{ count }}</strong
                  ><span>次交互计数</span>
                </div>
                <div class="counter-buttons">
                  <button
                    class="square-button"
                    aria-label="减少计数"
                    @click="changeCount(-1)"
                  >
                    <Icon name="minus" /></button
                  ><button
                    class="square-button"
                    aria-label="增加计数"
                    @click="changeCount(1)"
                  >
                    <Icon name="plus" />
                  </button>
                </div>
              </div>
              <p class="muted">点击按钮，查看行为轨迹中的变化。</p>
            </article>

            <article v-if="!isBehavior" class="card scenario-card">
              <div class="card-heading">
                <h3>异常与上报</h3>
                <span class="tiny-tag">4 个场景</span>
              </div>
              <p class="card-description">让问题主动出现，看看它的来龙去脉。</p>
              <div class="scenario-list">
                <button
                  class="scenario-button primary-scenario"
                  aria-label="手动上报"
                  @click="manualReport"
                >
                  <Icon name="send" /><span>手动上报</span
                  ><span class="scenario-pill">LOG</span></button
                ><VueErrorDemo
                  @trigger="state.notice = 'Vue 组件错误已触发。'"
                /><button class="scenario-button" @click="promiseError">
                  <Icon name="promise" /><span>Promise 异常</span
                  ><Icon name="arrow" class="trailing" /></button
                ><button class="scenario-button" @click="codeError">
                  <Icon name="bug" /><span>JavaScript 异常</span
                  ><Icon name="arrow" class="trailing" />
                </button>
              </div>
              <p v-if="vueErrorCollected" class="inline-feedback">
                <Icon name="check" />组件错误已采集，页面可以继续操作。
              </p>
            </article>

            <article v-if="!isBehavior" class="card request-card">
              <div class="card-heading">
                <h3>网络请求</h3>
                <Icon name="request" class="subtle-icon" />
              </div>
              <p class="card-description">对比正常响应与 HTTP 500 异常。</p>
              <div class="request-grid">
                <button class="outline-button" @click="fetchRequest(false)">
                  <span class="button-dot success"></span>正常 Fetch</button
                ><button
                  class="outline-button danger-button"
                  @click="fetchRequest(true)"
                >
                  <span class="button-dot danger"></span>异常 Fetch</button
                ><button class="outline-button" @click="xhrRequest(false)">
                  <span class="button-dot success"></span>正常 XHR</button
                ><button
                  class="outline-button danger-button"
                  @click="xhrRequest(true)"
                >
                  <span class="button-dot danger"></span>异常 XHR
                </button>
              </div>
            </article>

            <article v-if="isBehavior" class="card behavior-guide">
              <div class="guide-icon"><Icon name="stack" /></div>
              <h3>把操作连成线</h3>
              <p>
                点击计数器、切换页面，或回到异常演示发起请求。右侧会按时间展示
                SDK 收集的行为。
              </p>
              <div class="guide-types">
                <span>点击</span><span>路由</span><span>请求</span
                ><span>异常</span>
              </div>
              <button
                class="outline-button full-width"
                @click="navigate('scenarios')"
              >
                返回异常演示<Icon name="arrow" />
              </button>
            </article>
            <p class="operation-notice" role="status">
              <Icon name="check" /><span>{{ state.notice }}</span>
            </p>
          </section>

          <section class="card monitor-card" aria-label="采集结果">
            <div class="monitor-header">
              <div class="monitor-title">
                <span class="live-icon"><Icon name="activity" /></span>
                <h3>实时观察窗</h3>
                <span class="live-label">LIVE</span>
              </div>
              <button class="text-button" @click="clearRecords">
                <Icon name="trash" /><span>清空记录</span>
              </button>
            </div>
            <div class="monitor-toolbar">
              <div class="tabs" role="tablist" aria-label="采集结果类型">
                <button
                  role="tab"
                  :aria-selected="activeTab === 'reports'"
                  :class="{ selected: activeTab === 'reports' }"
                  @click="switchTab('reports')"
                >
                  上报记录<span>{{ state.reports.length }}</span></button
                ><button
                  role="tab"
                  :aria-selected="activeTab === 'breadcrumbs'"
                  :class="{ selected: activeTab === 'breadcrumbs' }"
                  @click="switchTab('breadcrumbs')"
                >
                  行为轨迹<span>{{ state.breadcrumbs.length }}</span>
                </button>
              </div>
              <label class="search-box"
                ><Icon name="search" /><input
                  v-model="search"
                  :placeholder="
                    activeTab === 'reports' ? '搜索上报' : '搜索行为'
                  "
                  aria-label="搜索采集结果"
              /></label>
            </div>

            <template v-if="activeTab === 'reports'">
              <div v-if="!state.reports.length" class="empty-state">
                <div class="empty-illustration">
                  <span></span><Icon name="stack" /><i></i>
                </div>
                <h4>还没有上报记录</h4>
                <p>触发左侧任意异常场景，<br />第一条记录就会出现在这里。</p>
                <span class="empty-hint"><i></i>等待你的第一次触发</span>
              </div>
              <template v-else
                ><div class="report-list" data-testid="report-list">
                  <button
                    v-for="report in filteredReports"
                    :key="report.id"
                    :class="[
                      'report-row',
                      { selected: report.id === state.selectedId },
                    ]"
                    @click="state.selectedId = report.id"
                  >
                    <span
                      :class="[
                        'type-badge',
                        report.payload.data.type.toLowerCase(),
                      ]"
                      >{{ report.payload.data.type }}</span
                    ><span class="report-summary">{{
                      report.payload.data.message || "请求异常"
                    }}</span
                    ><time>{{ formatTime(report.receivedAt) }}</time
                    ><Icon name="arrow" />
                  </button>
                  <p v-if="!filteredReports.length" class="no-match">
                    没有找到匹配的上报。
                  </p>
                </div>
                <div v-if="selected" class="report-inspector">
                  <div class="inspector-title">
                    <h4>上报详情</h4>
                    <span><Icon name="check" />本地接收成功 · HTTP 200</span>
                  </div>
                  <div class="report-meta">
                    <div>
                      <span>SDK 版本</span
                      ><strong>{{
                        selected.payload.authInfo.sdkVersion
                      }}</strong>
                    </div>
                    <div>
                      <span>发生时间</span
                      ><strong>{{
                        formatTime(selected.payload.data.time)
                      }}</strong>
                    </div>
                    <div>
                      <span>关联行为</span
                      ><strong
                        >{{ selected.payload.breadcrumb.length }} 条</strong
                      >
                    </div>
                  </div>
                  <div class="payload-label">
                    <Icon name="code" /><span>完整上报数据</span
                    ><span>JSON</span>
                  </div>
                  <pre data-testid="report-detail">{{
                    JSON.stringify(selected.payload, null, 2)
                  }}</pre>
                </div></template
              >
            </template>
            <div v-else class="timeline" data-testid="breadcrumb-list">
              <div v-if="!crumbs.length" class="no-match">
                试着点击一个按钮，行为会出现在这里。
              </div>
              <article
                v-for="(entry, index) in crumbs"
                :key="`${entry.time}-${index}`"
                class="timeline-entry"
              >
                <span class="timeline-point"></span>
                <div class="timeline-top">
                  <strong>{{ entry.type }}</strong
                  ><time>{{ formatTime(entry.time) }}</time>
                </div>
                <p>{{ describeBreadcrumb(entry) }}</p>
                <span class="timeline-category">{{ entry.category }}</span>
              </article>
            </div>
            <div class="monitor-footer">
              <span><i></i>当前会话 · 最多保留 50 条</span
              ><span>MitoJS × Vue 3</span>
            </div>
          </section>
        </div>
        <footer class="page-footer">
          <span>用更清晰的上下文，理解每一个前端问题。</span
          ><a
            href="https://github.com/mitojs/mitojs"
            target="_blank"
            rel="noreferrer"
            >MitoJS 开源项目<Icon name="link"
          /></a>
        </footer>
      </main>
    </div>
  </div>
</template>
