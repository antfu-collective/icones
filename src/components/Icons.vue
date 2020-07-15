<template>
  <div class="flex flex-wrap select-none" :class="`text-${size}`" :style="{ color }">
    <div
      v-for="icon of icons"
      :key="icon"
      class="icons-item cursor-pointer flex m-2"
      :class="selected.includes(namespace+icon) ? 'active': ''"
      @click="$emit('select', namespace+icon)"
    >
      <Icon :icon="namespace+icon" />
      <span v-if="display==='list'" class="text-sm ml-1 px-1 m-auto" v-html="getSearchHighlightHTML(icon, search)" />
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
  color: var(--theme-color);
  position: relative;
}
.icons-item.active::after {
  content: "";
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 4px;
  background: var(--theme-color);
  opacity: 0.1;
}
.icons-item:hover::before {
  content: "";
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  border-radius: 4px;
  border: 1px solid var(--theme-color);
  opacity: 0.4;
}
</style>
