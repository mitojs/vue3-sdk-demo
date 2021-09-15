<template>
  <NConfigProvider :theme-overrides="getThemeOverrides">
    <router-view></router-view>
  </NConfigProvider>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { NConfigProvider } from "naive-ui";
import { lighten, appTheme } from "@/utils";

export default defineComponent({
  components: {
    NConfigProvider,
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
