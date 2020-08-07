<template>
  <div class="relative">
    <div>
      <slot />
    </div>
    <input
      class="absolute top-0 bottom-0 left-0 right-0 opacity-0 w-full h-full cursor-pointer z-10"
      :value="value"
      type="color"
      @input="e=> $emit('update:value', e.target.value)"
    >
  </div>
</template>

<script script="props" lang="ts">
declare const props: {
  value: string
}
</script>
