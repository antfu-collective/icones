<script setup lang="ts">
// The highlighted code of a format, for the `snippet-code` outlet of `detailView`
import { collections } from '../data'
import { getIconSnippet, SnippetMap } from '../utils/icons'
import { highlight } from '../utils/shiki'
import { prettierCode } from '../utils/svg'

const props = defineProps<{
  icon: string
  type: string
  color: string
}>()

const snippet = computed(() => Object.values(SnippetMap).map(group => group[props.type]).find(Boolean))

const html = computedAsync(async () => {
  if (!props.type || !snippet.value)
    return ''
  const code = await getIconSnippet(collections, props.icon, props.type, false, props.color) || ''
  const formatted = (await prettierCode(code, snippet.value.prettierParser)).trim()
  return highlight(formatted, snippet.value.lang)
}, '')
</script>

<template>
  <!-- eslint-disable-next-line vue/no-v-html -->
  <div class="snippet-code" v-html="html" />
</template>
