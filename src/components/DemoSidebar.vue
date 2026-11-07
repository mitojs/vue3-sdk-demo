<script setup lang="ts">
import Icon from './Icon.vue'

defineProps<{ isBehavior: boolean }>()
const emit = defineEmits<{ navigate: [destination: string] }>()
</script>

<template>
  <aside class="sidebar">
    <a class="brand" href="#/scenarios" aria-label="MitoJS 首页">
      <span class="brand-symbol">m</span>
      <span>mito<span class="brand-light">js</span></span>
    </a>
    <div class="sidebar-content">
      <p class="nav-caption">SDK PLAYGROUND</p>
      <nav aria-label="演示导航">
        <button
          :class="['nav-item', { active: !isBehavior }]"
          :aria-current="!isBehavior ? 'page' : undefined"
          @click="emit('navigate', 'scenarios')">
          <Icon name="grid" />
          <span>异常演示</span>
          <Icon name="arrow" class="nav-arrow" />
        </button>
        <button
          :class="['nav-item', { active: isBehavior }]"
          :aria-current="isBehavior ? 'page' : undefined"
          @click="emit('navigate', 'behavior')">
          <Icon name="activity" />
          <span>行为轨迹</span>
          <Icon name="arrow" class="nav-arrow" />
        </button>
      </nav>
      <div class="sidebar-footer">
        <span class="vue-dot"></span>
        <span>Vue 3 集成示例</span>
        <p>让前端问题，有迹可循。</p>
      </div>
    </div>
  </aside>
</template>
