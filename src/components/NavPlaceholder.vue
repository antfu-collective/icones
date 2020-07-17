<template>
  <div v-if="isElectron" class="flex-none" style="height: 27px;"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { isElectron } from '../env'

export default defineComponent({
  setup() {
    return {
      isElectron
    }
  }
})
</script>