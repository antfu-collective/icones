<script setup lang="ts">
import type { PropType } from 'vue'
import { getSearchHighlightHTML, useThemeColor } from '../hooks'

const props = defineProps({
  icons: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  selected: {
    type: Array as PropType<string[]>,
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
  tooltip: {
    type: Boolean,
    default: true,
  },
})
const emit = defineEmits<{
  (event: 'select', id: string): void
}>()

const { style } = useThemeColor()

const selectedSet = computed(() => new Set(props.selected))

// One shared tooltip for the whole list, instead of one popper per icon
const hovered = ref<{ name: string, x: number, y: number } | null>(null)

function getItem(e: Event) {
  return (e.target as HTMLElement).closest<HTMLElement>('[data-icon]')
}

function onClick(e: MouseEvent) {
  const item = getItem(e)
  if (item)
    emit('select', props.namespace + item.dataset.icon)
}

function onPointerOver(e: PointerEvent) {
  if (!props.tooltip || props.display === 'list' || e.pointerType === 'touch')
    return
  const item = getItem(e)
  if (!item) {
    hovered.value = null
    return
  }
  const name = item.dataset.icon!
  if (hovered.value?.name === name)
    return
  const rect = item.getBoundingClientRect()
  hovered.value = { name, x: rect.left + rect.width / 2, y: rect.bottom }
}

function hideTooltip() {
  hovered.value = null
}

useEventListener('scroll', hideTooltip, { capture: true, passive: true })
</script>

<template>
  <div
    class="non-dragging flex flex-wrap select-none justify-center"
    :class="`text-${size} ${colorClass}`"
    @click="onClick"
    @pointerover="onPointerOver"
    @pointerleave="hideTooltip"
  >
    <div
      v-for="icon of icons" :key="icon"
      class="non-dragging icons-item relative"
      :class="[spacing, selectedSet.has(namespace + icon) ? 'active' : '']"
      :data-icon="icon"
    >
      <div v-if="display === 'list'" class="icon-border flex gap-1">
        <Icon
          class="non-dragging leading-none"
          :icon="namespace + icon"
        />
        <span
          class="text-sm px-1 m-auto"
          v-html="getSearchHighlightHTML(icon, search)"
        />
      </div>
      <Icon
        v-else
        class="non-dragging leading-none icon-border h-1em"
        :icon="namespace + icon"
      />
    </div>
    <Teleport v-if="tooltip" to="body">
      <div
        v-if="hovered"
        class="icons-tooltip fixed z-100 pointer-events-none px-2 py-1.5 leading-none text-sm text-primary bg-base border border-base rounded shadow-lg"
        :style="[style, { left: `${hovered.x}px`, top: `${hovered.y + 8}px` }]"
      >
        {{ hovered.name }}
      </div>
    </Teleport>
  </div>
</template>

<style>
.icons-item:hover,
.icons-item.active {
  color: var(--theme-color);
}

.icons-tooltip {
  transform: translateX(-50%);
  animation: icons-tooltip-in 0.12s ease-out;
}

@keyframes icons-tooltip-in {
  from {
    opacity: 0;
  }
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
