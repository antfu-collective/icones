<template>
  <div class="flex flex-col h-screen overflow-hidden" :style="style">
    <div class="h-full flex-auto overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import { themeColor } from './store'

export default defineComponent({
  setup() {
    const style = computed(() => ({
      '--theme-color': themeColor.value
    }))

    return {
      style
    }
  }
})
</script>
