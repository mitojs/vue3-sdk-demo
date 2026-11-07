<script setup lang="ts">
import { state } from '../state'
import Icon from './Icon.vue'
import CounterCard from './CounterCard.vue'
import ErrorScenarios from './ErrorScenarios.vue'
import NetworkRequests from './NetworkRequests.vue'
import BehaviorGuide from './BehaviorGuide.vue'

defineProps<{ isBehavior: boolean }>()
const emit = defineEmits<{ navigate: [destination: string] }>()
</script>

<template>
  <section class="controls-column" aria-label="场景操作">
    <CounterCard />
    <ErrorScenarios v-if="!isBehavior" />
    <NetworkRequests v-if="!isBehavior" />
    <BehaviorGuide v-if="isBehavior" @navigate="emit('navigate', $event)" />
    <p class="operation-notice" role="status"><Icon name="check" /><span>{{ state.notice }}</span></p>
  </section>
</template>
