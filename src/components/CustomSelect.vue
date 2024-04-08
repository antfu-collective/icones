<script setup lang='ts'>
defineProps<{
  options: {
    label: string
    children: {
      label: string
      value: string
      disabled?: boolean
    }[]
  }[]
  modelValue: string
}>()

const emit = defineEmits(['update:modelValue'])
const visible = ref(false)
const target = ref(null)

onClickOutside(target, () => visible.value = false)
</script>

<template>
  <div ref="target" relative>
    <div @click="visible = true">
      <slot />
    </div>
    <div
      v-if="visible"
      class="absolute rounded-md w-60 border-gray-300 border-1 dark:bg-dark-100 text-base top-20px right-0 z-10 shadow-md text-gray-500 px-4 py-2 bg-base"
    >
      <template v-for="(optgroup) in options" :key="optgroup.label">
        <div text-gray-600 font-semibold py-1>
          {{ optgroup.label }}
        </div>

        <div
          v-for="(option) in optgroup.children"
          :key="option.value"
          class="cursor-pointer mx-2 text-sm leading-6 py-1 pl-2 dark:hover-bg-gray-800 hover-bg-gray-100 hover-rounded"
          :class="{
            'color-primary': option.value === modelValue,
            'cursor-not-allowed opacity-50': option?.disabled,
          }"
          @click="{ emit('update:modelValue', option.value); visible = false; }"
        >
          {{ option.label }}
        </div>
      </template>
    </div>
  </div>
</template>
