<script lang='ts' setup>
import { Menu } from 'floating-vue'
import { getIconSnippet, type Snippet } from '../utils/icons'
import { prettierCode } from '../utils/prettier'
import { highlight } from '../utils/shiki'

const props = defineProps<{
  icon: string
  snippet: Snippet
  type: string
  color: string
}>()

const code = ref<string>('')

async function onShow() {
  if (!code.value)
    code.value = await getIconSnippet(props.icon, props.type, false, props.color) || ''
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
