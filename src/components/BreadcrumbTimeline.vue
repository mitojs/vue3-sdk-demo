<script setup lang="ts">
import { computed } from 'vue'
import type { Breadcrumb } from '../state'
import { formatBreadcrumb } from '../shared/report-model.js'

const props = defineProps<{ entries: Breadcrumb[]; query: string }>()
const filtered = computed(() => {
  const query = props.query.trim().toLowerCase()
  return [...props.entries].reverse().map((entry) => formatBreadcrumb(entry, { basePath: import.meta.env.BASE_URL })).filter((entry) =>
    `${entry.type} ${entry.category} ${entry.title} ${entry.detail}`.toLowerCase().includes(query),
  )
})
</script>

<template>
  <div v-if="!filtered.length" class="report-monitor__timeline" data-testid="breadcrumb-list">
    <p class="report-monitor__empty">
      {{ query ? '没有找到匹配的行为。' : '试着点击一个按钮，行为会出现在这里。' }}
    </p>
  </div>
  <ol v-else class="report-monitor__timeline" data-testid="breadcrumb-list">
      <li v-for="(entry, index) in filtered" :key="`${entry.time}-${index}`" class="report-monitor__timeline-entry">
        <time class="report-monitor__time">{{ entry.time }}</time>
        <span class="report-monitor__timeline-mark" aria-hidden="true"></span>
        <div>
          <div class="report-monitor__timeline-title">{{ entry.title }}</div>
          <p v-if="entry.detail" class="report-monitor__timeline-detail">{{ entry.detail }}</p>
          <span class="report-monitor__timeline-category">{{ entry.type }} · {{ entry.category }}</span>
        </div>
      </li>
  </ol>
</template>
