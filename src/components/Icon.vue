<template>
  <div ref="el" :class="$attrs.class" />
</template>
<script lang="ts">
import { defineComponent, watch, ref, onMounted, nextTick } from 'vue'

export default defineComponent({
  props: {
    icon: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const el = ref<HTMLElement | null>(null)

    const update = async() => {
      await nextTick()
      if (el.value) {
        // @ts-ignore
        const data = window.Iconify.getSVGObject(props.icon)
        if (data) {
          const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
          for (const key of Object.keys(data.attributes))
            svg.setAttribute(key, data.attributes[key])
          svg.innerHTML = data ? data.body : null
          if (el.value) {
            el.value.textContent = ''
            el.value.appendChild(svg)
          }
        }
        else {
          const span = document.createElement('span')
          span.className = 'iconify'
          span.dataset.icon = props.icon
          if (el.value) {
            el.value.textContent = ''
            el.value.appendChild(span)
          }
        }
      }
    }

    watch(
      () => props.icon,
      update,
      { flush: 'post' })

    onMounted(update)

    return {
      el,
    }
  },
})
</script>

<style>
span.iconify {
  background: #5551;
  border-radius: 100%;
  min-width: 10px;
  min-height: 1em;
}
</style>
