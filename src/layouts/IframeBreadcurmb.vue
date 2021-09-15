<template>
  <iframe
    ref="iframeRef"
    class="iframeWrapper"
    src="https://mitojs.github.io/mito-admin-demo/#/breadcrumbDemo"
    frameborder="0"
  ></iframe>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
export default defineComponent({
  setup() {
    const iframeRef = ref<HTMLIFrameElement>();

    let timer = null as any;

    onMounted(() => {
      let lastLength = -1;
      timer = setInterval(() => {
        const breadcrumb = (window as any).MitoInstance.breadcrumb;
        const length = breadcrumb.getStack().length;
        if (length === lastLength) {
          return;
        } else {
          lastLength = length;
          iframeRef?.value?.contentWindow &&
            iframeRef.value.contentWindow.postMessage(
              {
                type: "breadcrumb",
                data: JSON.parse(JSON.stringify(breadcrumb.getStack())),
              },
              "https://mitojs.github.io/mito-admin-demo/#/breadcrumbDemo"
            );
        }
      }, 1000);
    });
    onUnmounted(() => {
      if (timer) clearInterval(timer);
    });
    return {
      iframeRef,
    };
  },
});
</script>

<style lang="less" scoped>
.iframeWrapper {
  width: 100%;
  height: 100%;
  border: none;
}
</style>
