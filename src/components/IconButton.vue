<template>
  <div
    class="m-auto opacity-50 hover:opacity-75 cursor-pointer"
    @click="e => $emit('click', e)"
  >
    <Icon :icon="icon" />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Icon from '../components/Icon.vue'

export default defineComponent({
  components: {
    Icon
  },
  props: {
    icon: {
      type: String,
      required: true
    }
  }
})
</script>