<script setup lang='ts'>
import type { PropType } from 'vue'
import { iconSize, inProgress, listType, progressMessage, selectingMode } from '../store'
import { cacheCollection, downloadAndInstall, isInstalled } from '../data'
import type { CollectionMeta } from '../data'
import { PackIconFont, PackSvgZip } from '../utils/pack'
import { isElectron } from '../env'

const props = defineProps({
  collection: {
    type: Object as PropType<CollectionMeta>,
    required: true,
  },
})

const menu = ref(
  listType.value === 'list'
    ? 'list'
    : iconSize.value === 'text-4xl'
      ? 'large'
      : 'small',
)

const packIconFont = async() => {
  if (!props.collection)
    return

  progressMessage.value = 'Downloading...'
  inProgress.value = true
  await nextTick()
  await downloadAndInstall(props.collection.id)
  progressMessage.value = 'Packing up...'
  await nextTick()
  await PackIconFont(
    props.collection.icons.map(i => `${props.collection!.id}:${i}`),
    { fontName: props.collection.name, fileName: props.collection.id },
  )
  inProgress.value = false
}

const packSvgs = async() => {
  if (!props.collection)
    return

  progressMessage.value = 'Downloading...'
  inProgress.value = true
  await nextTick()
  await downloadAndInstall(props.collection.id)
  progressMessage.value = 'Packing up...'
  await nextTick()
  await PackSvgZip(
    props.collection.icons.map(i => `${props.collection!.id}:${i}`),
    props.collection.id,
  )
  inProgress.value = false
}

const cache = async() => {
  if (!props.collection)
    return

  await cacheCollection(props.collection.id)
}

watch(
  menu,
  async(current, prev) => {
    switch (current) {
      case 'small':
        iconSize.value = 'text-2xl'
        listType.value = 'grid'
        return
      case 'large':
        iconSize.value = 'text-4xl'
        listType.value = 'grid'
        return
      case 'list':
        iconSize.value = 'text-3xl'
        listType.value = 'list'
        return
      case 'select':
        selectingMode.value = !selectingMode.value
        break
      case 'download_iconfont':
        packIconFont()
        break
      case 'download_svgs':
        packSvgs()
        break
      case 'cache':
        cache()
        break
    }

    await nextTick()
    menu.value = prev
  },
  { flush: 'pre' },
)

const installed = computed(() => {
  return props.collection && isInstalled(props.collection.id)
})
</script>

<template>
  <div class="text-xl flex">
    <DarkSwitcher class="mx-2 opacity-25 align-middle" />

    <!-- Download State -->
    <IconButton
      v-if="installed && !isElectron"
      class="mx-2 opacity-25 align-middle"
      icon="carbon:checkmark-outline"
      title="Downloaded"
      :none="true"
    />

    <!-- Menu -->
    <div class="relative w-4">
      <IconButton :active="true" icon="carbon:overflow-menu-vertical" title="Menu" />
      <select
        v-model="menu"
        class="absolute dark:bg-dark-100 text-base top-0 bottom-0 left-0 right-0 opacity-0"
      >
        <optgroup label="Size">
          <option value="small">
            Small
          </option>
          <option value="large">
            Large
          </option>
          <option value="list">
            List
          </option>
        </optgroup>
        <optgroup label="Actions">
          <option value="select">
            Select multiple
          </option>
        </optgroup>

        <!--
          TODO: due to this function requires to download and pack
                the full set, we should make some UI to aware users
                in browser version.
        -->
        <optgroup label="Downloads">
          <option v-if="!isElectron && !installed" value="cache">
            Cache in Browser
          </option>
          <option value="download_iconfont" :disabled="inProgress">
            Iconfont
          </option>
          <option value="download_svgs" :disabled="inProgress">
            SVGs Zip
          </option>
        </optgroup>
      </select>
    </div>
  </div>
</template>
