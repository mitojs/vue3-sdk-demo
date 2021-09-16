<template>
  <n-gradient-text type="info">Count :{{ count }}</n-gradient-text>
  <n-space style="margin-top: 10px">
    <n-button type="primary" @click="add">加 +</n-button>
    <n-button @click="sub">减 -</n-button>
  </n-space>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { NButton, NGradientText, NSpace } from 'naive-ui'
export default defineComponent({
  components: {
    NButton,
    NGradientText,
    NSpace,
  },
  setup() {
    const count = ref(0)

    const add = () => {
      count.value++
    }

    const sub = () => {
      count.value--
    }

    return {
      count,
      add,
      sub,
    }
  },
})
</script>

<style lang="less" scoped>
.n-gradient-text {
  font-size: 30px;
}
</style>
