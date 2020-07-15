<template>
  <div class="flex flex-wrap" :class="`text-${size}`" :style="{color, '--hover-color': themeColor }">
    <div
      v-for="icon of icons"
      :key="icon"
      class="icons-item cursor-pointer flex m-2"
      :class="selected.includes(namespace+icon) ? 'active': ''"
      @click="$emit('select', namespace+icon)"
    >
      <Icon :icon="namespace+icon" />
      <span v-if="display==='list'" class="text-sm ml-2 m-auto" v-html="getSearchHighlightHTML(icon, search)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { themeColor } from '../store'
import { getSearchHighlightHTML } from '../hooks'

export default defineComponent({
  emits: ['select'],
  props: {
    icons: {
      type: Array,
      default: () => [],
    },
    selected: {
      type: Array,
      default: () => [],
    },
    size: {
      type: String,
      default: '2xl',
    },
    search: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#555',
    },
    display: {
      type: String,
      default: 'grid',
    },
    namespace: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    return {
      themeColor,
      getSearchHighlightHTML,
    }
  },
})
</script>

<style>
.icons-item:hover, .icons-item.active {
  color: var(--hover-color);
}
</style>
