import { reactive } from "vue";

export interface Breadcrumb {
  type?: string;
  category?: string;
  level?: string;
  time?: number;
  data?: unknown;
}
export interface Payload {
  authInfo: { sdkVersion: string; sdkName: string; apikey: string };
  data: {
    type: string;
    message?: string;
    time: number;
    level?: string;
    componentName?: string;
    request?: { url?: string; httpType?: string };
    response?: { status?: number };
    [key: string]: unknown;
  };
  breadcrumb: Breadcrumb[];
}
export interface Report {
  id: number;
  receivedAt: number;
  payload: Payload;
}

export const state = reactive({
  reports: [] as Report[],
  breadcrumbs: [] as Breadcrumb[],
  selectedId: null as number | null,
  notice: "选择一个场景，看看 MitoJS 收集了什么。",
});
let nextId = 1;

// Called only by the local receiver after it has read the actual SDK POST body.
export function receiveReport(payload: Payload) {
  const report = { id: nextId++, receivedAt: Date.now(), payload };
  state.reports.unshift(report);
  state.reports.splice(50);
  state.selectedId = report.id;
  if (payload.data.type === "VUE") {
    state.notice = "组件错误已采集，页面可以继续操作。";
  }
}

export function clearReports() {
  state.reports = [];
  state.selectedId = null;
  state.notice = "上报记录已清空。";
}

export function formatTime(time?: number) {
  return time
    ? new Date(time).toLocaleTimeString("zh-CN", { hour12: false })
    : "刚刚";
}

export function describeBreadcrumb(entry: Breadcrumb) {
  if (typeof entry.data === "string") return entry.data;
  if (!entry.data || typeof entry.data !== "object")
    return entry.category || "用户操作";
  const data = entry.data as Record<string, unknown>;
  const request = data.request as { url?: string } | undefined;
  return String(
    data.message ||
      request?.url ||
      data.to ||
      data.url ||
      entry.category ||
      "用户操作",
  );
}
