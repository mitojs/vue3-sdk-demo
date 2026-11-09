<script setup lang="ts">
import Icon from './Icon.vue'
const emit = defineEmits<{ navigate: [destination: string] }>()
</script>

<template>
  <article class="card behavior-guide">
    <div class="guide-icon"><Icon name="stack" /></div>
    <h3>把操作连成线</h3>
    <p>点击计数器、切换页面，或回到异常演示发起请求。右侧会按时间展示 SDK 收集的行为。</p>
    <div class="guide-types"><span>点击</span><span>路由</span><span>请求</span><span>异常</span></div>
    <button class="outline-button full-width" @click="emit('navigate', 'scenarios')">返回异常演示<Icon name="arrow" /></button>
  </article>
</template>
