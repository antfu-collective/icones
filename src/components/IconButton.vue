<template>
  <div
    class="m-auto cursor-pointer"
    :class="active ? 'opacity-100 hover:opacity-100 hover:text-primary' : 'opacity-25 hover:opacity-50' "
  >
    <Icon
      :icon="icon"
      class="inline-block align-middle"
    />
    <div
      v-if="text"
      class="text-xs ml-2 inline-block align-middle"
    >
      {{ text }}
    </div>
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
    text: {
      type: String,
    },
  },
})
</script>
