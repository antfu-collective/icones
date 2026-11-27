<script setup lang='ts'>
import { pushRecentCollection, setCurrentCollection } from '../../store'

const props = defineProps<{
  id: string
}>()

watch(
  () => props.id,
  () => setCurrentCollection(props.id),
  { immediate: true },
)

onUnmounted(() => setCurrentCollection(''))

onMounted(() => {
  pushRecentCollection(props.id)
})
</script>

<template>
  <!-- The page shows its own loading state, until the set is ready -->
  <IconSet />
</template>
