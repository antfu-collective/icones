
<template>
  <div class="p-4 m-6 fixed bottom-0 right-0 shadow-lg bg-white rounded-full text-2xl cursor-pointer hover:bg-gray-100">
    <Icon class="text-gray-700" :icon="icon" />
    <div
      v-if="number"
      class="absolute top-0 right-0 -mt-1 -mr-1 bg-primary text-white text-xs leading-none rounded-full shadow text-center"
      style="padding: 5px; min-width: 22px"
    >
      {{ number }}
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
    number: {
      type: Number,
      default: 0,
    },
  },
})
</script>
