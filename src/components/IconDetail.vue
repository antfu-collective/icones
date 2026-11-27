<script setup lang='ts'>
import type { DetailGroup } from '../sekiso/behavior/detail'
import { View } from '@sekiso/vue'
import { collections, getIconCategories } from '../data'
import { detailView } from '../sekiso/views/detail'
import { activeMode, copyPreviewColor, getTransformedId, inBag, isDark, preferredCase, previewColor, pushRecentIcon, selectedPackageManager, showHelp, toggleBag } from '../store'
import { idCases } from '../utils/case'
import { isLowContrast } from '../utils/color'
import { dataUrlToBlob } from '../utils/dataUrlToBlob'
import { Download, getIconSnippet, SnippetMap, toComponentName } from '../utils/icons'

const props = defineProps<{
  icon: string
  showCollection: boolean
}>()

const emit = defineEmits<{
  (event: 'close'): void
  (event: 'copy', ok: boolean): void
  (event: 'next'): void
  (event: 'prev'): void
}>()

const router = useRouter()
const collection = computed(() => collections.find(i => i.id === props.icon.split(':')[0]))
const color = computed(() => copyPreviewColor.value ? previewColor.value : 'currentColor')

onKeyStroke('ArrowLeft', (e) => {
  if (!props.icon)
    return
  emit('prev')
  e.preventDefault()
})

onKeyStroke('ArrowRight', (e) => {
  if (!props.icon)
    return
  emit('next')
  e.preventDefault()
})

async function copyText(text?: string) {
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {
    }
  }
  return false
}

async function copyPng(dataUrl: string): Promise<boolean> {
  try {
    const item = new ClipboardItem({
      'image/png': dataUrlToBlob(dataUrl),
    })
    await navigator.clipboard.write([item])
    return true
  }
  catch (e) {
    console.error('Failed to copy png error', e)
    return false
  }
}

async function copy(type: string) {
  pushRecentIcon(props.icon)
  const svg = await getIconSnippet(collections, props.icon, type, true, color.value)
  if (!svg)
    return
  emit('copy', type === 'png'
    ? await copyPng(svg)
    : await copyText(svg))
}

async function download(type: string) {
  pushRecentIcon(props.icon)
  const text = await getIconSnippet(collections, props.icon, type, false, color.value)
  if (!text)
    return
  const ext = (type === 'solid' || type === 'qwik' || type === 'react-native')
    ? 'tsx'
    : type
  const blob = type === 'png'
    ? dataUrlToBlob(text)
    : new Blob([text], { type: 'text/plain;charset=utf-8' })
  Download(blob, `${toComponentName(props.icon)}.${ext}`)
}

function toggleSelecting() {
  if (activeMode.value === 'select') {
    activeMode.value = 'normal'
  }
  else {
    activeMode.value = 'select'
    emit('close')
  }
}

// The install command was just copied
const installCopied = ref(false)
async function copyInstall() {
  const manager = selectedPackageManager.value
  const ok = await copyText(`${manager} ${manager !== 'npm'
    ? 'add'
    : 'i'} -D @iconify-json/${collection.value?.id}`)
  installCopied.value = ok
  setTimeout(() => installCopied.value = false, 2000)
}

const categories = computedAsync(() => props.icon
  ? getIconCategories(props.icon)
  : [], [])

const groups: DetailGroup[] = Object.entries(SnippetMap).map(([name, group]) => ({
  name,
  formats: Object.entries(group).map(([type, snippet]) => ({ type, name: snippet.name, tag: snippet.tag })),
}))

const downloads = [
  { type: 'svg', name: 'SVG' },
  { type: 'png', name: 'PNG' },
  { type: 'vue', name: 'Vue' },
  { type: 'jsx', name: 'React' },
  { type: 'tsx', name: 'React', tag: 'TS' },
  { type: 'svelte', name: 'Svelte' },
  { type: 'qwik', name: 'Qwik' },
  { type: 'solid', name: 'Solid' },
  { type: 'astro', name: 'Astro' },
  { type: 'react-native', name: 'React Native' },
]

const options = computed(() => {
  const icon = props.icon
  const set = collection.value
  return {
    open: Boolean(icon),
    icon,
    name: icon
      ? getTransformedId(icon)
      : '',
    cases: icon
      ? Object.entries(idCases).map(([key, toCase]) => ({
          key,
          label: toCase(icon),
        }))
      : [],
    preferredCase: preferredCase.value,
    license: set?.license ?? null,
    collection: props.showCollection && set
      ? { id: set.id, name: set.name }
      : null,
    categories: categories.value,
    inBag: Boolean(icon) && inBag(icon),
    selecting: activeMode.value === 'select',
    copyColor: copyPreviewColor.value,
    color: previewColor.value,
    lowContrast: isLowContrast(previewColor.value, isDark.value),
    groups,
    downloads,
    links: set && icon
      ? [
          { name: 'Iconify', href: `https://icon-sets.iconify.design/${set.id}/?icon-filter=${icon.split(':')[1]}` },
          { name: 'UnoCSS', href: `https://uno.antfu.me/?s=i-${icon.replace(':', '-')}` },
        ]
      : [],
    managers: ['pnpm', 'npm', 'yarn', 'bun'],
    manager: selectedPackageManager.value,
    packageName: set
      ? `@iconify-json/${set.id}`
      : '',
    copied: installCopied.value,
    navigate: (to: string) => router.push(to),
    close: () => emit('close'),
    copy,
    download,
    copyInstall,
    toggleBag: () => toggleBag(icon),
    toggleSelecting,
    toggleCopyColor: () => copyPreviewColor.value = !copyPreviewColor.value,
    setColor: (value: string) => previewColor.value = value,
    setCase: (key: string) => preferredCase.value = key as typeof preferredCase.value,
    setManager: (manager: string) => selectedPackageManager.value = manager,
    showHelp: () => showHelp.value = !showHelp.value,
  }
})
</script>

<template>
  <View :of="detailView" :options="options" />
</template>
