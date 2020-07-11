<template>
  <div v-if="icon" class="flex">
    <div class="p-4 text-gray-700">
      <Icon class="text-8xl" :icon="icon" />
    </div>
    <div class="px-2 py-4">
      <p class="font-mono flex text-gray-700 font-light">
        {{ icon }}
        <IconButton icon="carbon:copy" class="ml-2" @click="copy('id')" />
      </p>

      <div class="my-1 text-gray-500 mt-3">
        Copy
      </div>
      <button class="btn mr-1" @click="copy('url')">
        URL
      </button>
      <button class="btn mr-1" @click="copy('html')">
        HTML
      </button>
      <button class="btn mr-1" @click="copy('css')">
        CSS
      </button>
      <button class="btn mr-1" @click="copy('svg')">
        SVG
      </button>
      <button class="btn mr-1" @click="copy('data_url')">
        Data URL
      </button>
      <div class="my-1 text-gray-500 mt-3">
        Download
      </div>
      <a :href="downlodUrl">
        <button class="btn mr-1" @click="download()">SVG</button>
      </a>
    </div>
    <Notification :value="copied">
      <Icon icon="mdi:check" class="inline-block mr-2 font-xl" />Copied
    </Notification>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import Base64 from '../utils/base64'

export default defineComponent({
  props: {
    icon: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const copied = ref(false)

    const getSvg = () =>
      fetch(`https://api.iconify.design/${props.icon}.svg?inline=false&height=auto`)
        .then(r => r.text())

    const copy = async(type: string) => {
      if (!props.icon) return

      let text = props.icon
      switch (type) {
        case 'url':
          text = `https://api.iconify.design/${props.icon}.svg`
          break
        case 'html':
          text = `<span class="iconify" data-icon="${props.icon}" data-inline="false"></span>`
          break
        case 'css':
          text = `background: url('https://api.iconify.design/${props.icon}.svg') no-repeat center center / contain;`
          break
        case 'svg':
          text = await getSvg()
          break
        case 'data_url':
          text = `data:image/svg+xml;base64,${Base64.encode(await getSvg())}`
          break
      }

      await navigator.clipboard.writeText(text)
      copied.value = true

      setTimeout(() => {
        copied.value = false
      }, 2000)
    }

    const downlodUrl = computed(
      () =>
        `https://api.iconify.design/${props.icon}.svg?download=true&inline=false&height=auto`,
    )

    return {
      copy,
      copied,
      downlodUrl,
    }
  },
})
</script>
