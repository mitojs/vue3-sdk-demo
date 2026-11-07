<script setup lang="ts">
import Icon from './Icon.vue'
</script>

<template>
  <header class="topbar">
    <div class="breadcrumb">MitoJS<span>/</span><strong>Vue 3 演示</strong></div>
    <div class="header-actions">
      <span class="framework-tag">Vue 3</span>
      <a
        href="https://github.com/mitojs/vue3-sdk-demo"
        target="_blank"
        rel="noreferrer"
        class="github-link"
        aria-label="查看 GitHub 源码">
        <Icon name="github" />
        <span>GitHub</span>
        <Icon name="link" class="external-icon" />
      </a>
    </div>
  </header>
</template>
