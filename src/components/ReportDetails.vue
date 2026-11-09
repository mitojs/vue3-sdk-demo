<script setup lang="ts">
import { normalizeReport } from '../shared/report-model.js'

type NormalizedReport = ReturnType<typeof normalizeReport>
defineProps<{ report: NormalizedReport }>()
</script>

<template>
  <section class="report-monitor__details" data-testid="report-detail" aria-label="上报详情" aria-live="polite">
    <div class="report-monitor__detail-heading">
      <div class="report-monitor__detail-title">
        <span class="report-monitor__eyebrow">选中记录</span>
        <h4>{{ report.title }}</h4>
      </div>
      <div class="report-monitor__detail-status">
        <span v-if="report.status" class="report-monitor__status" :data-error="report.isError">{{ report.status }}</span>
        <span v-if="report.duration"> · {{ report.duration }} · </span>
        <span>{{ report.source }}</span>
      </div>
    </div>
    <dl class="report-monitor__fields">
      <template v-for="field in report.fields" :key="field.label">
        <dt>{{ field.label }}</dt><dd>{{ field.value }}</dd>
      </template>
    </dl>
    <details :key="report.id" class="report-monitor__json">
      <summary>完整上报 JSON</summary>
      <pre data-testid="report-json">{{ JSON.stringify(report.raw, null, 2) }}</pre>
    </details>
  </section>
</template>
