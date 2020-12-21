<template>
  <WithNavbar v-if="!collection">
    <div class="py-8 px-4 text-gray-700 text-center dark:text-dark-700">
      Loading...
    </div>
  </WithNavbar>
  <IconSet v-else :collection="collection" />
</template>

<script setup lang='ts'>
import { defineComponent, watch, onUnmounted, defineProps } from 'vue'
import { useCurrentCollection, setCurrentCollection } from '../../store'

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
})

watch(
  () => props.id,
  () => setCurrentCollection(props.id),
  { immediate: true },
)

onUnmounted(() => setCurrentCollection(''))

const collection = useCurrentCollection()
</script>
