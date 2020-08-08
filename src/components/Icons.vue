<template>
  <div
    class="non-dragging flex flex-wrap select-none justify-center "
    :class="`text-${size} ${colorClass}`"
  >
    <div
      v-for="icon of icons"
      :key="icon"
      class="non-dragging icons-item flex"
      :class="[spacing, selected.includes(namespace+icon) ? 'active': '']"
      @click="$emit('select', namespace+icon)"
    >
      <Icon class="non-dragging leading-none h-1em" :icon="namespace+icon" />
      <span v-if="display==='list'" class="text-sm ml-1 px-1 m-auto" v-html="getSearchHighlightHTML(icon, search)" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { themeColor } from '../store'
import { getSearchHighlightHTML } from '../hooks'

export default defineComponent({
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
    spacing: {
      type: String,
      default: 'm-2',
    },
    search: {
      type: String,
      default: '',
    },
    display: {
      type: String,
      default: 'grid',
    },
    namespace: {
      type: String,
      default: '',
    },
    colorClass: {
      type: String,
      default: 'text-dark-600 dark:text-dark-900',
    },
  },
  emits: ['select'],
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
