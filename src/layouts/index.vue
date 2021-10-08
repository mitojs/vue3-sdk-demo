<template>
  <n-layout class="layout" has-sider>
    <n-layout-sider width="200" class="layout-sider">
      <Logo></Logo>
      <n-menu :value="getSelectedKeys" @update:value="onMenuClick" :options="menus" />
    </n-layout-sider>
    <n-layout>
      <n-layout-header class="layout-header" position="static">
        <n-icon @click="onJumpGithub" size="40" class="header-logo">
          <GithubOutlined></GithubOutlined>
        </n-icon>
      </n-layout-header>

      <n-layout-content>
        <main class="layout-content">
          <n-alert style="margin-bottom: 14px" title="提示信息" type="info">
            右侧的Breadcrumb组件会实时打印的你操作行为。控制台会打印当前收集的信息.在控制台输入「MitoInstance」查看当前mito实例
          </n-alert>
          <div class="container">
            <div class="page-container">
              <router-view></router-view>
            </div>
            <div class="table-container">
              <IframeBreadcurmb></IframeBreadcurmb>
            </div>
          </div>
        </main>
      </n-layout-content>
      <n-back-top :right="100" />
    </n-layout>
  </n-layout>
</template>

<script lang="ts">
import { defineComponent, computed, unref, ref, watch } from 'vue'
import { GithubOutlined } from '@vicons/antd'
import { useRoute, useRouter } from 'vue-router'
import { NLayoutSider, NLayout, NLayoutHeader, NIcon, NBackTop, NMenu, NAlert, NLayoutContent } from 'naive-ui'
import Logo from './Logo.vue'
import IframeBreadcurmb from './IframeBreadcurmb.vue'

const menus = [
  {
    label: '示例页面一',
    key: 'page-one',
  },
  {
    label: '示例页面二',
    key: 'page-two',
  },
]

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
    NAlert,
    IframeBreadcurmb,
    NLayoutContent,
  },
  setup(props: any) {
    const currentRoute = useRoute()
    const router = useRouter()
    const selectedKeys = ref<string>(currentRoute.name as string)

    const getSelectedKeys = computed(() => {
      return unref(selectedKeys)
    })

    const onMenuClick = (key: string) => {
      if (/http(s)?:/.test(key)) {
        window.open(key)
      } else {
        router.push(key)
      }
    }

    // 跟随页面路由变化，切换菜单选中状态
    watch(
      () => currentRoute.fullPath,
      () => {
        selectedKeys.value = currentRoute.name as string
      }
    )

    return { menus, onMenuClick, getSelectedKeys }
  },
  methods: {
    onJumpGithub() {
      window.open('https://github.com/mitojs/mitojs', '_blank')
    },
  },
})
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
  .layout-content {
    padding: 14px;
    // height: 100%;
    height: calc(100vh - 64px);
    .container {
      width: 100%;
      display: flex;
      height: 100%;
    }
  }
  .page-container {
    width: 400px;
    margin-right: 14px;
  }
  .table-container {
    width: calc(100% - 414px);
  }
}
.n-layout-content {
  height: calc(100vh - 64px);
  background-color: rgb(240, 242, 245) !important;
}
.n-layout-scroll-container {
  height: none;
}
</style>
