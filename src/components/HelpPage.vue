<script setup lang="ts">
import { View } from '@sekiso/vue'
import { helpView } from '../sekiso/views/help'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ (event: 'close'): void }>()

const options = computed(() => ({
  open: props.open,
  close: () => emit('close'),
}))
</script>

<template>
  <View :of="helpView" :options="options" />
</template>
