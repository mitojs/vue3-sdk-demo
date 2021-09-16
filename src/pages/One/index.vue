<template>
  <n-card title="示例页面一">
    <Count></Count>
  </n-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { NCard } from 'naive-ui'
import Count from './Count.vue'

export default defineComponent({
  components: {
    NCard,
    Count,
  },
})
</script>

<style></style>
