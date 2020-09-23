<template>
  <div class="flex flex-col h-screen overflow-hidden" :style="style">
    <div class="h-full flex-auto overflow-auto">
      <router-view />
    </div>
    <Progress />
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { themeColor } from './store'

export default defineComponent({
  setup() {
    const style = computed(() => ({
      '--theme-color': themeColor.value,
    }))

    return {
      style,
    }
  },
})
</script>
<style >
  * {
    overscroll-behavior: contain;
    -webkit-overflow-scrolling: touch;
    -ms-overflow-style: -ms-autohiding-scrollbar;
    scrollbar-width: 6px;
    scrollbar-color: rgba(0,0,0,.2);
  }

  ::-webkit-scrollbar {
    height: 6px;
    width: 6px;
  }

  ::-webkit-scrollbar-track-piece {
    background: rgba(9,30,66,.08);
  }

  ::-webkit-scrollbar-thumb {
    background: rgba(128,128,128,0.4);
    border-radius: 3px;
  }
</style>
