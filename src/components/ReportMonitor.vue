<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { monitoring } from '../monitoring'
import { clearReports, state } from '../state'
import { matchesReport, normalizeReport } from '../shared/report-model.js'
import Icon from './Icon.vue'
import ReportTable from './ReportTable.vue'
import ReportDetails from './ReportDetails.vue'
import BreadcrumbTimeline from './BreadcrumbTimeline.vue'

const props = defineProps<{ behaviorView: boolean }>()
const activeTab = ref(props.behaviorView ? 'breadcrumbs' : 'reports')
const search = ref('')
const reports = computed(() => state.reports.map((report) => normalizeReport(report, { basePath: import.meta.env.BASE_URL })))
const filtered = computed(() => reports.value.filter((report) => matchesReport(report, search.value)))
const selected = computed(() => filtered.value.find((report) => report.id === state.selectedId))

watch(() => props.behaviorView, (behavior) => switchTab(behavior ? 'breadcrumbs' : 'reports'))
watch(filtered, (records) => {
  if (records.length && !records.some((report) => report.id === state.selectedId)) selectReport(records[0]!.id)
})
function switchTab(tab: string) {
  activeTab.value = tab
  search.value = ''
}
function selectReport(id: number | string) {
  state.selectedId = state.reports.find((report) => report.id === id)?.id ?? null
}
function clearRecords() {
  monitoring.breadcrumb.clear()
  state.breadcrumbs = []
  clearReports()
  search.value = ''
  state.notice = '当前会话记录已清空。'
}
</script>

<template>
  <section class="report-monitor" aria-label="采集结果">
    <div class="report-monitor__header">
      <div class="report-monitor__heading">
        <span class="report-monitor__live-icon"><Icon name="activity" /></span>
        <h3>实时观察窗</h3><span class="report-monitor__live-label">LIVE</span>
      </div>
      <button class="report-monitor__clear" @click="clearRecords"><Icon name="trash" /><span>清空记录</span></button>
    </div>
    <div class="report-monitor__tabs" role="tablist" aria-label="采集结果类型">
      <button
        id="reports-tab"
        class="report-monitor__tab"
        role="tab"
        aria-controls="reports-panel"
        :aria-selected="activeTab === 'reports'"
        @click="switchTab('reports')">上报记录<span>{{ state.reports.length }}</span></button>
      <button
        id="breadcrumbs-tab"
        class="report-monitor__tab"
        role="tab"
        aria-controls="breadcrumbs-panel"
        :aria-selected="activeTab === 'breadcrumbs'"
        @click="switchTab('breadcrumbs')">行为轨迹<span>{{ state.breadcrumbs.length }}</span></button>
    </div>
    <div class="report-monitor__toolbar">
      <span class="report-monitor__context" aria-live="polite">
        {{ activeTab === 'reports' ? `${filtered.length} 条记录` : `${state.breadcrumbs.length} 个行为` }} · 当前会话
      </span>
      <label class="report-monitor__search">
        <Icon name="search" />
        <input v-model="search" :placeholder="activeTab === 'reports' ? '搜索摘要、状态、来源' : '搜索行为轨迹'" aria-label="搜索采集结果" />
      </label>
    </div>
    <div v-if="activeTab === 'reports'" id="reports-panel" role="tabpanel" aria-labelledby="reports-tab">
      <div v-if="!state.reports.length" class="report-monitor__empty">
        <span class="report-monitor__empty-icon"><Icon name="stack" /></span>
        <h4>还没有上报记录</h4>
        <p>触发左侧异常场景或正常、异常网络请求，第一条记录就会出现在这里。</p>
        <span class="report-monitor__empty-hint">等待你的第一次触发</span>
      </div>
      <template v-else>
        <ReportTable :reports="filtered" :selected-id="state.selectedId" @select="selectReport" />
        <ReportDetails v-if="selected" :report="selected" />
      </template>
    </div>
    <div v-else id="breadcrumbs-panel" role="tabpanel" aria-labelledby="breadcrumbs-tab">
      <BreadcrumbTimeline :entries="state.breadcrumbs" :query="search" />
    </div>
    <div class="report-monitor__footer"><span>当前会话 · 最多保留 50 条</span><span>MitoJS × Vue 3</span></div>
  </section>
</template>
