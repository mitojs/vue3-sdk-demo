# MitoJS Vue 3 SDK 演示

基于 Vue 3、Vite 和 TypeScript 的交互式演示，使用公开 npm 包接入 `@mitojs/browser` 和 `@mitojs/vue`。页面延续 [React SDK Demo](https://github.com/mitojs/react-sdk-demo) 的侧栏、蓝色提示条和双栏卡片布局。

## 本地启动

需要 Node.js **24.22.2** 与 pnpm **12.16.1**（版本分别记录在 `.nvmrc` 和 `package.json`）。

```sh
pnpm install --frozen-lockfile
pnpm dev
```

打开 <http://localhost:2033/vue3-sdk-demo/>。如需预览生产构建：

```sh
pnpm build
pnpm preview
```

开发服务器和预览服务器都使用 2033 端口，二者选其一运行。

## 可以体验什么

- **异常演示**：手动日志上报、Vue 组件事件错误、Promise 未处理拒绝、JavaScript 全局异常。
- **网络请求**：Fetch / XHR 的正常响应与 HTTP 500，异常由 SDK 自动采集。
- **行为轨迹**：查看真实 SDK 收集的点击、路由、请求和异常上下文。
- **实时观察窗**：本地接收的上报列表、搜索、详情切换、完整 JSON 与清空记录。

SDK 通过 `init(options, [vuePlugin])` 初始化，将 `createApp()` 返回的 Vue 应用传给 `options.vue`。浏览器和框架异常由 SDK 自动监听，演示按钮只负责触发场景。组件错误采集后页面仍可继续使用。

SDK 的 `browser` / `vue` 固定为 `4.0.0-beta.1`。本次发布沿用 `@mitojs/shared@4.0.0-beta.0`，所以上报载荷中的 `sdkVersion` 为 `4.0.0-beta.0`；观察窗直接展示实际载荷。

## 本地上报

[MSW](https://mswjs.io/) 在当前浏览器中处理同源的 `/vue3-sdk-demo/api/report` POST 请求，读取 SDK 实际发送的 JSON，再交给观察窗展示。成功和失败的演示 API 也由 MSW 返回，因此无需后端，不向外部监控服务发送演示数据。列表最多保留当前页面会话的 50 条上报，刷新后重置。

请通过 `localhost` 或 HTTPS 访问，让浏览器可以注册 Service Worker。`public/mockServiceWorker.js` 由 `pnpm exec msw init public --save` 生成，升级 MSW 后应重新生成。

## 验证

```sh
pnpm exec playwright install --no-shell chromium
pnpm verify
```

`verify` 执行类型检查、生产构建和浏览器验收。验收自动在 2035 端口启动生产预览，检查真实 SDK 的 LOG、VUE、PROMISE、HTTP、JAVASCRIPT POST 载荷和本地 200 响应，以及版本、组件名称、关联行为、列表搜索、路由刷新、清空和 390px / 768px 无水平溢出。截图与真实载荷保存在被 Git 忽略的 `.cache/validation/`。

可以用 `BASE_URL=http://localhost:2033/vue3-sdk-demo/ pnpm test` 验收已运行的预览服务。GitHub Actions 使用相同命令完成验证并保存证据，不执行部署。

## 构建路径

Vite 的 `base` 固定为 `/vue3-sdk-demo/`，对应组织仓库的 GitHub Pages 路径；页面导航使用 hash 路由，刷新子页面无需服务端回退。生产文件输出到 `docs/`，构建时会清理旧的 hash 文件。

仓库保留现有 GitHub Pages 发布方式：从 `master` 分支的 `/docs` 目录提供 [在线演示](https://mitojs.github.io/vue3-sdk-demo/)。修改源码后运行 `pnpm build`，将更新后的 `docs/` 产物一并提交，不需要修改 Pages 设置。

框架版本依据 [Vue 官方快速开始](https://vuejs.org/guide/quick-start.html) 与 npm registry 核实（2026-11-07）。当前使用 Vue 3.5.45、Vite 8.3.6、vue-tsc 3.3.14；TypeScript 固定为 vue-tsc 支持的 6.0.3。

## 组件与共用资源

`App.vue` 负责组合页面。侧栏、顶栏、场景控制、计数器与网络请求各有独立组件；`ReportMonitor` 组合 `ReportTable`、`ReportRow`、`ReportDetails` 和 `BreadcrumbTimeline`，展示紧凑的记录表、可读详情与完整上报 JSON。

`src/shared/` 中的 `demo-shell.css`、`report-monitor.css`、`report-model.js` 和类型声明在 Vue2、Vue3、React 三个 demo 保持一致，以本仓库为共同源，修改后同步对应文件。各仓库纳入相同版本文件，安装和运行均不依赖本地兄弟目录。搜索只读取当前事件的摘要、来源和状态；三位 HTTP 状态码精确匹配，避免误中堆栈行列号或历史行为。

`pnpm verify` 还会运行共用展示模型的单元测试，再验证真实 SDK 上报、过滤、选行、JSON、清空和移动布局。
