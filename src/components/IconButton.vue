<script setup lang='ts'>
defineProps({
  icon: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: false,
  },
  none: {
    type: Boolean,
    default: false,
  },
  text: {
    type: String,
    default: '',
  },
  to: {
    type: String,
    default: '',
  },
  /**
   * Accessible name, for buttons without a visible text
   */
  label: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    :type="to ? undefined : 'button'"
    :aria-label="label || undefined"
    :title="label || undefined"
    class="icon-button m-auto"
    :class="none ? '' : active ? 'opacity-100 hover:opacity-100' : 'opacity-25 hover:opacity-50'"
  >
    <Icon
      :key="icon"
      aria-hidden="true"
      :icon="icon"
      class="inline-block align-middle"
    />
    <div
      v-if="text"
      class="text-xs ml-2 inline-block align-middle"
    >
      {{ text }}
    </div>
  </component>
</template>
