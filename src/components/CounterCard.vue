<script setup lang="ts">
import { ref } from 'vue'
import { state } from '../state'
import Icon from './Icon.vue'

const count = ref(0)
function changeCount(delta: number) {
  count.value += delta
  state.notice = `计数已更新为 ${count.value}，点击行为已记录。`
}
</script>

<template>
  <article class="card counter-card">
    <div class="card-label"><Icon name="activity" /><span>交互计数器</span><span class="tiny-tag">DOM</span></div>
    <div class="counter-controls">
      <div><strong data-testid="counter">{{ count }}</strong><span>次交互计数</span></div>
      <div class="counter-buttons">
        <button class="square-button" aria-label="减少计数" @click="changeCount(-1)"><Icon name="minus" /></button>
        <button class="square-button" aria-label="增加计数" @click="changeCount(1)"><Icon name="plus" /></button>
      </div>
    </div>
    <p class="muted">点击按钮，查看行为轨迹中的变化。</p>
  </article>
</template>
