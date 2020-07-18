<template>
  <div class="p-2 flex flex-col md:flex-row md:text-left relative">
    <IconButton class="absolute top-0 right-0 p-3 text-2xl flex-none leading-none" icon="carbon:close" @click="$emit('close')" />
    <ColorPicker v-model:value="previewColor" class="inline-block">
      <div :style="{color: previewColor}">
        <Icon class="p-4 text-8xl" :icon="icon" />
      </div>
    </ColorPicker>
    <div class="px-6 py-2 mb-4 md:px-2 md:py-4">
      <a class="text-gray-500 hover:text-primary text-sm" href="https://iconify.design/docs/iconify-in-pages/" target="_blank">
        How to use the icon?
      </a>
      <p class="flex text-gray-700 font-mono">
        {{ icon }}
        <IconButton icon="carbon:copy" class="ml-2" @click="copy('id')" />
      </p>

      <div>
        <div
          class="inline-block border border-gray-200 my-2 mr-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-100"
          :class="inBag(icon) ? 'text-primary' : 'text-gray-500'"
          @click="toggleBag(icon)"
        >
          <template v-if="inBag(icon)">
            <Icon class="inline-block text-lg align-middle" icon="carbon:shopping-bag" />
            in bag
          </template>
          <template v-else>
            <Icon class="inline-block text-lg align-middle" icon="carbon:add" />
            add to bag
          </template>
        </div>

        <div
          v-if="inBag(icon)"
          class="inline-block my-2 mr-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-100"
          :class="selectingMode ? 'text-primary' : 'text-gray-500'"
          @click="toggleSelectingMode"
        >
          <Icon class="inline-block text-lg align-middle" icon="carbon:list-checked" />
          multiple select
        </div>
      </div>

      <div class="flex flex-wrap">
        <div class="mr-4">
          <div class="my-1 text-gray-500 mt-3">
            Copy
          </div>
          <button class="btn mr-1 mb-1" @click="copy('url')">
            URL
          </button>
          <button class="btn mr-1 mb-1" @click="copy('html')">
            HTML
          </button>
          <button class="btn mr-1 mb-1" @click="copy('css')">
            CSS
          </button>
          <button class="btn mr-1 mb-1" @click="copy('svg')">
            SVG
          </button>
          <button class="btn mr-1 mb-1" @click="copy('data_url')">
            Data URL
          </button>
        </div>
        <div class="mr-4">
          <div class="my-1 text-gray-500 mt-3">
            Download
          </div>
          <a :href="downlodUrl">
            <button class="btn mr-1 mb-1" @click="download()">SVG</button>
          </a>
        </div>
      </div>
    </div>
    <Notification :value="copied">
      <Icon icon="mdi:check" class="inline-block mr-2 font-xl" />Copied
    </Notification>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { getIconSnippet, getIconDownloadLink } from '../utils/icons'
import { previewColor, toggleBag, inBag, selectingMode } from '../store'

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  setup(props, { emit }) {
    const copied = ref(false)

    const copy = async(type: string) => {
      const text = await getIconSnippet(props.icon, type)
      if (!text)
        return

      await navigator.clipboard.writeText(text)
      copied.value = true
      setTimeout(() => {
        copied.value = false
      }, 2000)
    }

    const toggleSelectingMode = () => {
      selectingMode.value = !selectingMode.value
      if (selectingMode.value)
        emit('close')
    }

    const downlodUrl = computed(() => getIconDownloadLink(props.icon))

    return {
      copy,
      copied,
      downlodUrl,
      previewColor,
      toggleBag,
      inBag,
      selectingMode,
      toggleSelectingMode,
    }
  },
})
</script>
