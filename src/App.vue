<template>
  <NConfigProvider :theme-overrides="getThemeOverrides">
    <NMessageProvider>
      <router-view></router-view>
    </NMessageProvider>
  </NConfigProvider>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { NConfigProvider, NMessageProvider } from "naive-ui";
import { lighten, appTheme } from "@/utils";

export default defineComponent({
  components: {
    NConfigProvider,
    NMessageProvider,
  },
  setup() {
    /**
     * @type import('naive-ui').GlobalThemeOverrides
     */
    const getThemeOverrides = computed(() => {
      const lightenStr = lighten(appTheme, 6);
      return {
        common: {
          primaryColor: appTheme,
          primaryColorHover: lightenStr,
          primaryColorPressed: lightenStr,
        },
        LoadingBar: {
          colorLoading: appTheme,
        },
      };
    });

    return { getThemeOverrides };
  },
});
</script>
