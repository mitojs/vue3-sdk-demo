<script setup lang="ts">
import Icon from './Icon.vue'

defineProps<{ isBehavior: boolean; reports: number; breadcrumbs: number }>()
</script>

<template>
  <div class="page-heading">
    <div>
      <p class="eyebrow">OBSERVE. UNDERSTAND. IMPROVE.</p>
      <h1>Vue 3 SDK 演示</h1>
      <p class="page-description">从一次点击开始，体验前端监控的完整过程。</p>
    </div>
    <span class="ready-indicator"><i></i>本地接收已就绪</span>
  </div>
  <div class="info-banner">
    <Icon name="info" />
    <div>
      <strong>点击左侧场景，实时查看采集结果</strong>
      <p>异常会自动生成上报记录，日常操作会留在行为轨迹中。所有演示数据仅在当前浏览器内接收。</p>
    </div>
    <span class="banner-badge">实时采集</span>
  </div>
  <div class="section-intro">
    <div>
      <h2>{{ isBehavior ? '每一步操作，都有迹可循。' : '试着触发一个场景' }}</h2>
      <p>{{ isBehavior ? '还原异常发生前的点击、请求与页面跳转。' : '选择一种异常，右侧即刻呈现完整上报。' }}</p>
    </div>
    <span class="section-count">{{ reports }} 条上报<span>·</span>{{ breadcrumbs }} 个行为</span>
  </div>
</template>
