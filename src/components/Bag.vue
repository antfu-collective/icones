<script setup lang='ts'>
import type { BagPack } from '../sekiso/behavior/bag'
import type { PackType } from '../utils/svg'
import { View } from '@sekiso/vue'
import { collections } from '../data'
import { isVSCode } from '../env'
import { BagSelectKey } from '../hooks'
import { bagView } from '../sekiso/views/bag'
import { bags, clearBag } from '../store'
import { getBagShareUrl } from '../utils/bag'
import { PackIconFont, PackSVGSprite, PackZip } from '../utils/pack'

defineProps<{ open: boolean }>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'select', value: string): void
}>()

provide(BagSelectKey, icon => emit('select', icon))

const { copy, copied } = useClipboard({ legacy: true })

const formats: { type: PackType, name: string, tag?: string }[] = [
  { type: 'svg', name: 'SVG' },
  { type: 'vue', name: 'Vue' },
  { type: 'jsx', name: 'React' },
  { type: 'tsx', name: 'React', tag: 'TS' },
  { type: 'svelte', name: 'Svelte' },
  { type: 'qwik', name: 'Qwik' },
  { type: 'solid', name: 'Solid' },
  { type: 'astro', name: 'Astro' },
  { type: 'react-native', name: 'React Native' },
  { type: 'json', name: 'JSON' },
]

async function pack(kind: BagPack) {
  if (kind === 'iconfont')
    await PackIconFont(collections, bags.value)
  else if (kind === 'sprite')
    await PackSVGSprite(collections, bags.value)
  else
    await PackZip(collections, bags.value, 'icones-bags', kind.slice('zip:'.length) as PackType)
}

const options = computed(() => ({
  count: bags.value.length,
  shared: copied.value,
  formats,
  close: () => emit('close'),
  share: () => copy(getBagShareUrl(bags.value, isVSCode ? 'https://icones.js.org' : location.origin)),
  clear: () => {
    // eslint-disable-next-line no-alert
    if (confirm('Are you sure to remove all icons from the bag?')) {
      clearBag()
      emit('close')
    }
  },
  pack,
}))
</script>

<template>
  <View :of="bagView" :options="{ ...options, open }" />
</template>
