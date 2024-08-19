<script setup lang='ts'>
const props = withDefaults(defineProps<{
  value?: boolean
  direction?: string
}>(), {
  value: false,
  direction: 'bottom',
})

const emit = defineEmits(['close'])

const { width, height } = useWindowSize()
const isSmall = computed(() => width.value < 600 || height.value < 450)

const positionClass = computed(() => {
  if (isSmall.value)
    return 'bottom-0 left-0 right-0 top-0 of-auto'
  switch (props.direction) {
    case 'bottom':
      return 'bottom-0 left-0 right-0 border-t'
    case 'top':
      return 'top-0 left-0 right-0 border-b'
    case 'left':
      return 'bottom-0 left-0 top-0 border-r'
    case 'right':
      return 'bottom-0 top-0 right-0 border-l'
    default:
      return ''
  }
})

const transform = computed(() => {
  switch (props.direction) {
    case 'bottom':
      return 'translateY(100%)'
    case 'top':
      return 'translateY(-100%)'
    case 'left':
      return 'translateX(-100%)'
    case 'right':
      return 'translateX(100%)'
    default:
      return ''
  }
})
</script>

<template>
  <div
    fixed top-0 bottom-0 left-0 right-0 z-40
    :class="value ? '' : 'pointer-events-none'"
  >
    <div
      bg-base bottom-0 left-0 right-0 top-0 absolute transition-opacity duration-500 ease-out
      :class="value ? 'opacity-85' : 'opacity-0'"
      @click="emit('close')"
    />
    <div
      bg-base border border-base absolute transition-all duration-200 ease-out
      :class="positionClass"
      :style="value ? {} : { transform }"
    >
      <slot />
    </div>
  </div>
</template>
