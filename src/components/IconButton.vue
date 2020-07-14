<template>
  <div class="m-auto cursor-pointer">
    <Icon
      :icon="icon"
      :class="active ? 'opacity-100 hover:opacity-100' : 'opacity-25 hover:opacity-50' "
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Icon from '../components/Icon.vue'

export default defineComponent({
  components: {
    Icon,
  },
  props: {
    icon: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
    },
  },
})
</script>
