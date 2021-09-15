import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import { App } from "vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/index.vue"),
    children: [
      {
        path: "/",
        redirect: "/page-one",
      },
      {
        path: "/page-one",
        name: "page-one",
        component: () => import("@/pages/One/index.vue"),
      },
      {
        path: "/page-two",
        name: "page-two",
        component: () => import("@/pages/Two/index.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHashHistory(""),
  routes: routes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export function setupRouter(app: App) {
  app.use(router);
  // 创建路由守卫
}

export default router;
