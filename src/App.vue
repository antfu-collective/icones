<template>
  <div class="flex flex-col h-screen overflow-hidden" :style="style">
    <div class="flex flex-auto overflow-hidden">
      <Drawer v-if="!isRoot" class="h-full overflow-auto flex-none hidden md:block" style="width:300px" />
      <div class="h-full flex-auto overflow-auto">
        <router-view />
        <Footer />
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'
import Drawer from './components/Drawer.vue'
import { themeColor } from './store'

export default defineComponent({
  components: {
    Navbar,
    Drawer,
    Footer,
  },
  setup() {
    const route = useRoute()
    const isRoot = computed(() => route.path === '/')

    const style = computed(() => ({
      '--theme-color': themeColor.value,
    }))

    return {
      isRoot,
      style,
    }
  },
})
</script>
