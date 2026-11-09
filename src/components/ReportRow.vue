<script setup lang="ts">
import { normalizeReport } from '../shared/report-model.js'

type NormalizedReport = ReturnType<typeof normalizeReport>
defineProps<{ report: NormalizedReport; selected: boolean }>()
const emit = defineEmits<{ select: [id: NormalizedReport['id']] }>()
</script>

<template>
  <button
    type="button"
    class="report-monitor__row"
    :aria-pressed="selected"
    :data-report-id="report.id"
    @click="emit('select', report.id)">
    <span class="report-monitor__type" :data-type="report.type" :data-error="String(report.isError)">{{ report.badge }}</span>
    <span class="report-monitor__summary">
      <span class="report-monitor__title">{{ report.title }}</span>
      <span v-if="report.location" class="report-monitor__location">{{ report.location }}</span>
    </span>
    <span class="report-monitor__outcome">
      <span v-if="report.status || report.duration" class="report-monitor__outcome-top">
        <span v-if="report.status" class="report-monitor__status" :data-error="String(report.isError)">{{ report.status }}</span>
        <span v-if="report.duration" class="report-monitor__duration">{{ report.duration }}</span>
      </span>
      <span :class="report.type === 'HTTP' ? 'report-monitor__source-detail' : 'report-monitor__source'">{{ report.source }}</span>
      <span v-if="report.type !== 'HTTP' && report.sourceDetail" class="report-monitor__source-detail">{{ report.sourceDetail }}</span>
    </span>
    <time class="report-monitor__time">{{ report.time }}</time>
  </button>
</template>
