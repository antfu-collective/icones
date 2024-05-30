<script setup lang="ts">
import type { PropType } from 'vue'
import { Tooltip } from 'floating-vue'
import { getSearchHighlightHTML, useThemeColor } from '../hooks'

defineProps({
  icons: {
    type: Array as PropType<any[]>,
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
})
defineEmits<{
  (event: 'select', id: string): void
}>()

const { style } = useThemeColor()
</script>

<template>
  <div class="non-dragging flex flex-wrap select-none justify-center" :class="`text-${size} ${colorClass}`">
    <div
      v-for="icon of icons " :key="icon" class="non-dragging icons-item relative"
      :class="[spacing, selected.includes(namespace + icon) ? 'active' : '']"
      @click="$emit('select', namespace + icon)"
    >
      <div v-if="display === 'list'" class="icon-border flex gap-1">
        <Icon
          :key="icon" class="non-dragging leading-none" :cache="true"
          :icon="namespace + icon"
        />
        <span
          class="text-sm px-1 m-auto"
          v-html="getSearchHighlightHTML(icon, search)"
        />
      </div>
      <Tooltip v-else placement="bottom">
        <Icon
          :key="icon" class="non-dragging leading-none icon-border h-1em" :cache="true"
          :icon="namespace + icon"
        />
        <template #popper>
          <div :style="style" class="leading-none border-none z-100 text-primary opacity-75 text-sm">
            {{ icon }}
          </div>
        </template>
      </Tooltip>
    </div>
  </div>
</template>

<style>
.icons-item:hover,
.icons-item.active {
  color: var(--theme-color);
}

.icon-border {
  position: relative;
}

.icon-border.active::after {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 4px;
  background: var(--theme-color);
  opacity: 0.1;
}

.icon-border:hover::before {
  content: '';
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
