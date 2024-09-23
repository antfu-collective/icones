<script lang='ts' setup>
import type { BuiltInParserName } from 'prettier'
import { Menu } from 'floating-vue'
import { prettierCode } from '../utils/prettier'
import { highlight } from '../utils/shiki'

const props = defineProps<{
  code: string
  type: string
  lang: string
  parser: BuiltInParserName
}>()

const emit = defineEmits<{
  (e: 'show'): void
}>()

const highlightCode = computedAsync(async () => {
  const code = await prettierCode(props.code, props.parser)
  return highlight(code, props.lang)
})
</script>

<template>
  <Menu :delay="0" placement="top" distance="10" @show="emit('show')">
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
