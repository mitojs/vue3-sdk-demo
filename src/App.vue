<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { state } from './state'
import Icon from './components/Icon.vue'
import DemoSidebar from './components/DemoSidebar.vue'
import DemoTopbar from './components/DemoTopbar.vue'
import PageIntro from './components/PageIntro.vue'
import ScenarioControls from './components/ScenarioControls.vue'
import ReportMonitor from './components/ReportMonitor.vue'

const route = ref(window.location.hash === '#/behavior' ? 'behavior' : 'scenarios')
const isBehavior = computed(() => route.value === 'behavior')
function syncRoute() {
  route.value = window.location.hash === '#/behavior' ? 'behavior' : 'scenarios'
}
function navigate(destination: string) {
  window.location.hash = destination === 'behavior' ? '/behavior' : '/scenarios'
  syncRoute()
}
onMounted(() => window.addEventListener('hashchange', syncRoute))
onUnmounted(() => window.removeEventListener('hashchange', syncRoute))
</script>

<template>
  <div class="app-shell">
    <DemoSidebar :is-behavior="isBehavior" @navigate="navigate" />
    <div class="workspace">
      <DemoTopbar />
      <main>
        <PageIntro :is-behavior="isBehavior" :reports="state.reports.length" :breadcrumbs="state.breadcrumbs.length" />
        <div class="demo-grid">
          <ScenarioControls :is-behavior="isBehavior" @navigate="navigate" />
          <ReportMonitor :behavior-view="isBehavior" />
        </div>
        <footer class="page-footer">
          <nav aria-label="其他框架演示"><a href="https://mitojs.github.io/react-sdk-demo/">React 19 SDK 演示</a> · <a href="https://mitojs.github.io/vue2-sdk-demo/">Vue 2 SDK 演示</a></nav>
          <a href="https://github.com/mitojs/mitojs" target="_blank" rel="noreferrer">MitoJS 开源项目<Icon name="link" /></a>
        </footer>
      </main>
    </div>
  </div>
</template>
