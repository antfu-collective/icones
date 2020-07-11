<template>
  <div class="flex" v-if="icon">
    <div class="text-6xl p-4 text-gray-700">
      <Icon :icon="icon" />
    </div>
    <div class="px-2 py-4">
      <p class="font-mono flex text-gray-700 font-light">
        {{icon}}
        <IconButton icon="mdi:content-copy" @click="copy('id')" class="ml-2" />
      </p>

      <div class="my-1 text-gray-500 mt-3">Copy</div>
      <button class="btn mr-1" @click="copy('url')">URL</button>
      <button class="btn mr-1" @click="copy('html')">HTML</button>
      <button class="btn mr-1" @click="copy('css')">CSS</button>
      <button class="btn mr-1" @click="copy('svg')">SVG</button>
      <div class="my-1 text-gray-500 mt-3">Download</div>
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
import Icon from '../components/Icon.vue'
import IconButton from '../components/IconButton.vue'
import Notification from '../components/Notification.vue'

export default defineComponent({
  components: {
    Icon,
    IconButton,
    Notification
  },
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const copied = ref(false)

    const copy = async (type: string) => {
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
          text = await fetch(
            `https://api.iconify.design/${props.icon}.svg?inline=false&height=auto`
          ).then(r => r.text())
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
        `https://api.iconify.design/${props.icon}.svg?download=true&inline=false&height=auto`
    )

    return {
      copy,
      copied,
      downlodUrl
    }
  }
})
</script>