<template>
  <div class="flex" v-if="icon">
    <div class="text-6xl p-4 text-gray-700">
      <Icon :icon="icon" />
    </div>
    <div class="px-2 py-4">
      <p class="font-mono flex text-gray-700 font-light">
        {{icon}}
        <IconButton icon="mdi:content-copy" @click="copyId" class="ml-2" />
      </p>
      <p class="text-gray-500">WIP... more info</p>

      <div class="my-1 text-gray-700 mt-3">Copy</div>
      <button class="btn mr-1">HTML</button>
      <button class="btn mr-1">CSS</button>
      <button class="btn mr-1">SVG</button>
      <div class="my-1 text-gray-700 mt-3">Download</div>
      <button class="btn mr-1">SVG</button>
      <button class="btn mr-1">PNG</button>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent } from 'vue'
import Icon from '../components/Icon.vue'
import IconButton from '../components/IconButton.vue'

export default defineComponent({
  components: {
    Icon,
    IconButton
  },
  props: {
    icon: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const copyId = () => {
      if (props.icon) {
        navigator.clipboard.writeText(props.icon)
      }
    }

    return {
      copyId
    }
  }
})
</script>