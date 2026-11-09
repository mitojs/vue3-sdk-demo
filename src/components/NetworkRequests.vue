<script setup lang="ts">
import { apiURL } from '../mock'
import { state } from '../state'
import Icon from './Icon.vue'

async function fetchRequest(failure: boolean) {
  try {
    const response = await fetch(`${apiURL}${failure ? 'failure' : 'success'}`)
    await response.json()
    state.notice = response.ok ? 'Fetch 请求成功 · HTTP 200，已采集到上报记录。' : 'Fetch 请求异常 · HTTP 500，已自动上报。'
  } catch {
    state.notice = 'Fetch 请求未完成，请刷新页面重试。'
  }
}
function xhrRequest(failure: boolean) {
  const xhr = new XMLHttpRequest()
  xhr.open('GET', `${apiURL}${failure ? 'failure' : 'success'}`)
  xhr.addEventListener('loadend', () => {
    state.notice = xhr.status === 200 ? 'XHR 请求成功 · HTTP 200，已采集到上报记录。' : `XHR 请求异常 · HTTP ${xhr.status}，已自动上报。`
  })
  xhr.send()
}
</script>

<template>
  <article class="card request-card">
    <div class="card-heading"><h3>网络请求</h3><Icon name="request" class="subtle-icon" /></div>
    <p class="card-description">正常响应和 HTTP 500 异常都会出现在上报记录中。</p>
    <div class="request-grid">
      <button class="outline-button" @click="fetchRequest(false)"><span class="button-dot success"></span>正常 Fetch</button>
      <button class="outline-button danger-button" @click="fetchRequest(true)"><span class="button-dot danger"></span>异常 Fetch</button>
      <button class="outline-button" @click="xhrRequest(false)"><span class="button-dot success"></span>正常 XHR</button>
      <button class="outline-button danger-button" @click="xhrRequest(true)"><span class="button-dot danger"></span>异常 XHR</button>
    </div>
  </article>
</template>
