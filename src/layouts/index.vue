<template>
  <n-layout class="layout" has-sider>
    <n-layout-sider width="200" class="layout-sider">
      <Logo></Logo>
      <n-menu :options="menus" />
    </n-layout-sider>
    <n-layout>
      <n-layout-header class="layout-header" position="static">
        <n-icon @click="onJumpGithub" size="40" class="header-logo">
          <GithubOutlined></GithubOutlined>
        </n-icon>
      </n-layout-header>

      <n-layout-content class="layout-content">
        <div class="layout-content-main">
          <div class="main-view">123123123</div>
        </div>
      </n-layout-content>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { GithubOutlined } from "@vicons/antd";
import {
  NLayoutSider,
  NLayout,
  NLayoutHeader,
  NIcon,
  NBackTop,
  NMenu,
} from "naive-ui";
import Logo from "./Logo.vue";

const menus = [
  {
    label: "事例页面一",
    key: "/page-one",
  },
  {
    label: "事例页面二",
    key: "/page-two",
  },
];

export default defineComponent({
  components: {
    NLayoutSider,
    NLayout,
    NLayoutHeader,
    Logo,
    NIcon,
    NBackTop,
    GithubOutlined,
    NMenu,
  },
  setup() {
    return { menus };
  },
  methods: {
    onJumpGithub() {
      window.open("https://github.com/mitojs/mitojs", "_blank");
    },
  },
});
</script>

<style lang="less" scoped>
.layout {
  display: flex;
  flex-direction: row;
  flex: auto;
  .layout-sider {
    min-height: 100vh;
    box-shadow: 2px 0 8px 0 rgb(29 35 41 / 5%);
    position: relative;
    z-index: 13;
    transition: all 0.2s ease-in-out;
  }
  .layout-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    height: 64px;
    box-shadow: 0 1px 4px rgb(0 21 41 / 8%);
    transition: all 0.2s ease-in-out;
    width: 100%;
    z-index: 11;
    padding: 0 20px;
    .header-logo {
      margin-left: auto;
      cursor: pointer;
    }
  }
}
</style>
