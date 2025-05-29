<script lang='ts' setup>
import type { CollectionInfo } from '../data'
import type { Snippet } from '../utils/icons'
import { Menu } from 'floating-vue'
import { collections } from '../data'
import { getIconSnippet } from '../utils/icons'
import { highlight } from '../utils/shiki'
import { prettierCode } from '../utils/svg'

const props = defineProps<{
  collection?: CollectionInfo
  icon: string
  snippet: Snippet
  type: string
  color: string
}>()

const code = ref<string>('')

async function onShow() {
  if (!code.value) {
    code.value = await getIconSnippet(
      props.collection ? [props.collection] : collections,
      props.icon,
      props.type,
      false,
      props.color,
    ) || ''
  }
}

const highlightCode = computedAsync(async () => {
  const c = code.value
  const formatted = (await prettierCode(c, props.snippet.prettierParser)).trim()
  return highlight(formatted, props.snippet.lang)
})
</script>

<template>
  <Menu :delay="0" placement="top" distance="10" @show="onShow">
    <slot />
    <template #popper>
      <div color-base px3 py2 border="b base" bg-gray:5>
        Snippet Preview
        <span op50>Click the button to copy</span>
      </div>
      <div w-full max-h-50 of-auto>
        <div h-fit max-w-70 sm:max-w-100 md:max-w-120 lg:max-w-150 p2 text-sm v-html="highlightCode" />
      </div>
    </template>
  </Menu>
</template>
