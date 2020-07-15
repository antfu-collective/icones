<template>
  <div class="h-full flex flex-col" style="width:40vw;">
    <div class="flex-none border-b border-gray-200 py-3 px-6 flex">
      <div>
        <div class="text-gray-700 text-lg">
          Bag
        </div>
        <div class="text-gray-500 text-xs">
          {{ iconsCart.length }} icons picked
        </div>
      </div>
      <div class="flex-auto" />
      <IconButton class="text-xl mr-4 flex-none" icon="carbon:delete" @click="clear" />
      <IconButton class="text-2xl flex-none" icon="carbon:close" @click="$emit('close')" />
    </div>
    <div class="flex-auto overflow-y-auto py-3 px-5">
      <Icons :icons="iconsCart" />
    </div>
    <div class="flex-none border-t border-gray-200 py-3 px-5 text-2xl text-gray-700">
      <IconButton icon="carbon:function" text="Generate Icon Fonts" :active="true" />
      <IconButton icon="carbon:download" text="Download All SVGs" :active="true" />
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { iconsCart, clearCart } from '../store'

export default defineComponent({
  setup() {
    const clear = () => {
      // eslint-disable-next-line no-alert
      if (confirm('Are you sure to remove all icons from the bag?'))
        clearCart()
    }

    return {
      clear,
      iconsCart,
    }
  },
})
</script>
