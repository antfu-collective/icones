<script setup lang='ts'>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div
    class="
      p-4 m-6 fixed bottom-0 right-0 shadow-lg bg-white rounded-full text-2xl cursor-pointer border border-transparent hover:bg-gray-50
      dark:bg-dark-100 dark:border dark:border-dark-300 dark:hover:bg-dark-200
    "
  >
    <Icon class="block text-gray-700 dark:text-gray-400" :icon="icon" />
    <div
      v-if="number"
      class="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-white text-xs leading-none rounded-full shadow text-center"
      style="padding: 5px; min-width: 22px"
    >
      {{ number }}
    </div>
  </div>
</template>
