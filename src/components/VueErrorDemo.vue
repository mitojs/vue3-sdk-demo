<script setup lang="ts">
import Icon from "./Icon.vue";
defineOptions({ name: "VueErrorDemo" });
const emit = defineEmits<{ trigger: [] }>();
function triggerError() {
  emit("trigger");
  throw new Error("Vue 组件演示错误");
}
</script>

<template>
  <button class="scenario-button" @click="triggerError">
    <Icon name="vue" /><span>Vue 组件错误</span
    ><Icon name="arrow" class="trailing" />
  </button>
</template>
