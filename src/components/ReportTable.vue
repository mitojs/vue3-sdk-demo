<script setup lang="ts">
import { normalizeReport } from '../shared/report-model.js'
import ReportRow from './ReportRow.vue'

type NormalizedReport = ReturnType<typeof normalizeReport>
defineProps<{ reports: NormalizedReport[]; selectedId: number | string | null }>()
const emit = defineEmits<{ select: [id: NormalizedReport['id']] }>()
</script>

<template>
  <div class="report-monitor__columns" aria-hidden="true">
    <span>类型</span><span>摘要 / 发生位置</span><span>来源 / 结果</span><span>时间</span>
  </div>
  <div class="report-monitor__list" data-testid="report-list" aria-label="上报记录列表">
    <ReportRow
      v-for="report in reports"
      :key="report.id"
      :report="report"
      :selected="report.id === selectedId"
      @select="emit('select', $event)" />
    <p v-if="!reports.length" class="report-monitor__empty">没有找到匹配的上报。</p>
  </div>
</template>
