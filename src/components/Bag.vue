<script setup lang='ts'>
import { bags, clearBag } from '../store'
import { PackIconFont, PackSVGSprite, PackZip } from '../utils/pack'
import type { PackType } from '../utils/pack'

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'select', value: string): void
}>()

const showPackOption = ref(false)

function clear() {
  // eslint-disable-next-line no-alert
  if (confirm('Are you sure to remove all icons from the bag?')) {
    clearBag()
    emit('close')
  }
}

async function packIconFont() {
  // TODO: customzie
  await PackIconFont(
    bags.value,
  )
}

async function packSVGSprite() {
  await PackSVGSprite(
    bags.value,
  )
}

async function PackSvgs(type: PackType = 'svg') {
  await PackZip(
    bags.value,
    'icones-bags',
    type,
  )
}
</script>

<template>
  <div class="h-full flex flex-col w-screen md:w-96 xl:w-128">
    <div
      class="
        py-3 px-6 flex flex-none border-b border-base
      "
    >
      <div>
        <NavPlaceholder class="md:hidden" />
        <div class="text-lg">
          Bag
        </div>
        <div class="opacity-50 text-xs">
          {{ bags.length }} icons picked
        </div>
      </div>
      <div class="flex-auto" />
      <IconButton v-if="bags.length" class="text-xl mr-4 flex-none" icon="carbon:delete" @click="clear" />
      <IconButton class="text-2xl flex-none" icon="carbon:close" @click="$emit('close')" />
    </div>

    <template v-if="bags.length">
      <div class="flex-auto overflow-y-overflow py-3 px-1">
        <Icons :icons="bags" @select="(e: any) => $emit('select', e)" />
      </div>

      <div
        v-show="showPackOption"
        class="relative flex-none border-t border-base py-3 px-6 text-2xl opacity-75"
      >
        <IconButton class="absolute top-0 right-0 p-3 text-2xl flex-none leading-none" icon="carbon:close" @click="showPackOption = false" />
        <button class="btn small mr-1 mb-1 opacity-75" @click="PackSvgs('svg')">
          SVG
        </button>
        <button class="btn small mr-1 mb-1 opacity-75" @click="PackSvgs('vue')">
          Vue
        </button>
        <button class="btn small mr-1 mb-1 opacity-75" @click="PackSvgs('jsx')">
          React
        </button>
        <button class="btn small mr-1 mb-1 opacity-75" @click="PackSvgs('tsx')">
          React<sup class="opacity-50 -mr-1">TS</sup>
        </button>
        <button class="btn small mr-1 mb-1 opacity-75" @click="PackSvgs('json')">
          JSON
        </button>
      </div>

      <div
        class="
          flex-none border-t border-base py-3 px-6 text-2xl opacity-75
        "
      >
        <IconButton class="p-1 cursor-pointer hover:text-primary" icon="carbon:download" text="Download Zip" :active="true" @click="showPackOption = true" />
        <IconButton class="p-1 cursor-pointer hover:text-primary" icon="carbon:function" text="Generate Icon Fonts" :active="true" @click="packIconFont" />
        <IconButton class="p-1 cursor-pointer hover:text-primary" icon="carbon:apps" text="Download SVG Sprite" :active="true" @click="packSVGSprite" />
      </div>
    </template>

    <template v-else>
      <div class="text-center px-4 py-8 text-gray-500 italic font-light text-sm">
        No icons yet ;)
      </div>
    </template>
  </div>
</template>
