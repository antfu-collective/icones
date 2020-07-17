<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <Navbar v-if="!isElectron" />
    <NavElectron v-if="isElectron" />
    <div class="flex-auto overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import NavElectron from './NavElectron.vue'
import { isElectron } from '../env'

export default defineComponent({
  components: {
    NavElectron
  },
  setup() {
    return {
      isElectron
    }
  }
})
</script>
