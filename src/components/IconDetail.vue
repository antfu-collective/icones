<template>
  <div v-if="icon" class="p-2 flex flex-col md:flex-row md:text-left">
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

      <div
        class="hidden md:inline-block border border-gray-200 my-2 font-sans pl-2 pr-3 py-1 rounded-full text-sm cursor-pointer hover:bg-gray-100"
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
import { previewColor, toggleBag, inBag } from '../store'

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  setup(props) {
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

    const downlodUrl = computed(() => getIconDownloadLink(props.icon))

    return {
      copy,
      copied,
      downlodUrl,
      previewColor,
      toggleBag,
      inBag,
    }
  },
})
</script>
