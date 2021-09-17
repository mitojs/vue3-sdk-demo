<template>
  <n-card title="事例页面一">
    <Count></Count>
    <n-space style="margin-top: 10px">
      <n-button @click="onUnhandledrejection">触发unhandledrejection</n-button>
      <n-button @click="onClickCodeError">触发代码错误</n-button>
      <n-button @click="onClickGoodRequest">触发正常xhr</n-button>
      <n-button @click="onClickBadRequest">触发异常xhr</n-button>
      <n-button @click="onClickGoodFetch">触发正常fetch</n-button>
      <n-button @click="onClickBadFetch">触发异常fetch</n-button>
      <n-button @click="onClickMitoLog">手动上报</n-button>
    </n-space>
  </n-card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NCard, NButton, NSpace, useMessage } from "naive-ui";
import Count from "./Count.vue";

export default defineComponent({
  components: {
    NCard,
    Count,
    NButton,
    NSpace,
  },
  setup() {
    const message = useMessage();

    const onUnhandledrejection = () => {
      const rejectPromise = () =>
        new Promise((resolve, reject) => reject("this is promise reject"));
      rejectPromise().then((res) => {
        console.log(res);
      });
    };

    const onClickCodeError = () => {
      this.obj.split("");
    };

    const onClickGoodRequest = () => {
      const xhr = new XMLHttpRequest();
      xhr.open("get", "https://jsonplaceholder.typicode.com/todos/1");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send();
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          message.success("request success");
        }
      };
    };

    const onClickBadRequest = () => {
      const xhr = new XMLHttpRequest();
      xhr.open("get", "https://cccccc/abnormal");
      xhr.setRequestHeader("content-type", "application/json");
      xhr.send();
      xhr.onreadystatechange = function () {
        console.log("xhr", xhr);
        if (xhr.readyState === 4 && !xhr.response) {
          message.error("request error");
        }
      };
    };

    const onClickGoodFetch = async () => {
      fetch("https://jsonplaceholder.typicode.com/todos/1", {
        method: "GET",
      }).then(
        (res) => {
          message.success("request success");
        },
        (err) => {
          console.log("err", err);
        }
      );
    };

    const onClickBadFetch = () => {
      fetch("http://cccccc/abnormal", {
        method: "GET",
      }).then(
        (res) => {},
        (err) => {
          console.log("err", err);
          message.error("request error");
        }
      );
    };

    const onClickMitoLog = () => {
      (window as any).MitoInstance.log({
        message: "some msg",
        tag: "your tag",
      });
    };

    return {
      onUnhandledrejection,
      onClickCodeError,
      onClickGoodRequest,
      onClickBadRequest,
      onClickGoodFetch,
      onClickBadFetch,
      onClickMitoLog,
    };
  },
});
</script>

<style></style>
