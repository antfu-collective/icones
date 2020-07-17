<template>
  <div class="px-1 text-xl text-gray-800 flex">
    <IconButton
      class="ml-3"
      icon="carbon:checkbox-checked"
      :active="selectingMode"
      @click="selectingMode = !selectingMode"
    />
    <div class="mr-1 ml-4 h-full m-auto bg-gray-200 hidden sm:block" style="width:1px;" />
    <IconButton
      class="ml-3 hidden sm:block"
      icon="carbon:hinton-plot"
      title="Small"
      :active="listType === 'grid' && iconSize === '2xl'"
      @click="()=>setGrid('small')"
    />
    <IconButton
      class="ml-3 hidden sm:block"
      icon="carbon:app-switcher"
      title="Large"
      :active="listType === 'grid' && iconSize === '4xl'"
      @click="()=>setGrid('large')"
    />
    <IconButton
      class="ml-3 hidden sm:block"
      icon="carbon:list"
      title="List View"
      :active="listType === 'list'"
      @click="()=>setGrid('list')"
    />
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType } from 'vue'
import { iconSize, listType, selectingMode } from '../store'
import { CollectionMeta } from '../data'

export default defineComponent({
  props: {
    collection: {
      type: Object as PropType<CollectionMeta>
    }
  },
  setup() {
    const setGrid = (type: string) => {
      switch (type) {
        case 'small':
          iconSize.value = '2xl'
          listType.value = 'grid'
          break
        case 'large':
          iconSize.value = '4xl'
          listType.value = 'grid'
          break
        default:
          iconSize.value = '3xl'
          listType.value = 'list'
      }
    }

    return {
      setGrid,
      listType,
      iconSize,
      selectingMode
    }
  }
})
</script>