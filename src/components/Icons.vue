<template>
  <div class="flex flex-wrap" :class="`text-${size}`" :style="{color, '--hover-color': themeColor }">
    <div
      v-for="icon of icons"
      :key="icon"
      class="icons-item cursor-pointer flex m-2"
      :class="selected.includes(icon) ? 'active': ''"
      @click="$emit('select', icon)"
    >
      <Icon :icon="icon" />
      <span v-if="display==='list'" class="text-sm ml-2 opacity-60 m-auto" v-html="searchNameHTML(icon)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { themeColor } from '../store'

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
  },
  setup(props) {
    const searchNameHTML = (icon: string) => {
      if (!props.search)
        return icon

      const start = icon.indexOf(props.search)
      if (start < 0)
        return icon

      const end = start + props.search.length
      return `${icon.slice(0, start)}<b class="font-bold">${icon.slice(start, end)}</b>${icon.slice(end)}`
    }

    return {
      themeColor,
      searchNameHTML,
    }
  },
})
</script>

<style>
.icons-item:hover, .icons-item.active {
  color: var(--hover-color);
}
</style>
