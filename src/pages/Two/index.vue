<template>
  <n-card title="事例页面二">
    <n-button @click="onJump" type="primary">跳转到事例页面一</n-button>
  </n-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NButton } from "naive-ui";
import { useRouter } from "vue-router";
export default defineComponent({
  components: {
    NCard,
    NButton,
  },
  setup() {
    const router = useRouter();

    const onJump = () => {
      router.push("page-one");
    };

    return {
      onJump,
    };
  },
});
</script>

<style></style>
