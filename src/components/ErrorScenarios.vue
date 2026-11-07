<script setup lang="ts">
import { computed } from 'vue'
import { monitoring } from '../monitoring'
import { state } from '../state'
import Icon from './Icon.vue'
import VueErrorDemo from './VueErrorDemo.vue'

const vueErrorCollected = computed(() => state.reports.some((report) => report.payload.data.type === 'VUE'))
function manualReport() {
  monitoring.log({ message: '这是一条来自 Vue 3 演示的手动上报', tag: 'vue3-demo' })
  state.notice = '手动上报已触发。'
}
function promiseError() {
  void Promise.reject(new Error('Promise 演示异常'))
  state.notice = 'Promise 异常已触发。'
}
function codeError() {
  window.setTimeout(() => { throw new Error('JavaScript 演示异常') }, 0)
  state.notice = 'JavaScript 异常已触发。'
}
</script>

<template>
  <article class="card scenario-card">
    <div class="card-heading"><h3>异常与上报</h3><span class="tiny-tag">4 个场景</span></div>
    <p class="card-description">让问题主动出现，看看它的来龙去脉。</p>
    <div class="scenario-list">
      <button class="scenario-button primary-scenario" aria-label="手动上报" @click="manualReport">
        <Icon name="send" /><span>手动上报</span><span class="scenario-pill">LOG</span>
      </button>
      <VueErrorDemo @trigger="state.notice = 'Vue 组件错误已触发。'" />
      <button class="scenario-button" @click="promiseError"><Icon name="promise" /><span>Promise 异常</span><Icon name="arrow" class="trailing" /></button>
      <button class="scenario-button" @click="codeError"><Icon name="bug" /><span>JavaScript 异常</span><Icon name="arrow" class="trailing" /></button>
    </div>
    <p v-if="vueErrorCollected" class="inline-feedback"><Icon name="check" />组件错误已采集，页面可以继续操作。</p>
  </article>
</template>
