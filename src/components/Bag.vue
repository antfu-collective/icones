<template>
  <div class="h-full flex flex-col w-screen md:w-16">
    <div class="flex-none border-b border-gray-200 py-3 px-6 flex">
      <div>
        <div class="text-gray-700 text-lg">
          Bag
        </div>
        <div class="text-gray-500 text-xs">
          {{ bags.length }} icons picked
        </div>
      </div>
      <div class="flex-auto" />
      <IconButton v-if='bags.length' class="text-xl mr-4 flex-none" icon="carbon:delete" @click="clear" />
      <IconButton class="text-2xl flex-none" icon="carbon:close" @click="$emit('close')" />
    </div>
    <template v-if="bags.length">
      <div class="flex-auto overflow-y-auto py-3 px-1">
        <Icons :icons="bags" />
      </div>
      <div class="flex-none border-t border-gray-200 py-3 px-6 text-2xl text-gray-700">
        <IconButton class="p-1 cursor-pointer" icon="carbon:function" text="Generate Icon Fonts" :active="true" @click="pack()" />
        <IconButton class="p-1 cursor-pointer" icon="carbon:download" text="Download All SVGs" :active="true" @click="wip" />
      </div>
    </template>
    <template v-else>
      <div class="text-center px-4 py-8 text-gray-500 italic font-light text-sm">
        No icons yet ;)
      </div>
    </template>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import { bags, clearBag } from '../store'
import { PackIconsInBag } from '../utils/pack'

export default defineComponent({
  setup() {
    const clear = () => {
      // eslint-disable-next-line no-alert
      if (confirm('Are you sure to remove all icons from the bag?'))
        clearBag()
    }

    return {
      clear,
      bags,
      pack: PackIconsInBag,
      // eslint-disable-next-line no-alert
      wip: () => alert('WIP'),
    }
  },
})
</script>
