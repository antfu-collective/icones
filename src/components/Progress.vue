<script setup lang='ts'>
import { View } from '@sekiso/vue'
import { progressView } from '../sekiso/views/help'
import { inProgress, progressMessage } from '../store'

const options = computed(() => ({ active: inProgress.value, message: progressMessage.value }))
</script>

<template>
  <View :of="progressView" :options="options" />
</template>
