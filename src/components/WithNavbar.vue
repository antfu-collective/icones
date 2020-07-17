<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <ElectronNav v-if='isElectron'/>
    <Navbar v-else :class="navClass" />
    <div class="flex-auto overflow-auto">
      <slot />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import ElectronNav from './ElectronNav.vue'
import { isElectron } from '../env'

export default defineComponent({
   components: {
    ElectronNav
  },
  props: {
    navClass: {
      type: String,
      default: '',
    },
  },
  setup(){
    return {
       isElectron,
    }
  }
})
</script>
