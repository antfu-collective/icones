<template>
  <div class="text-xl text-gray-800 flex">
    <!-- Download State -->
    <IconButton v-if="installed && !isElectron" none class="text-xl mr-3 opacity-25" icon="carbon:checkmark-outline" title="Downloaded" />

    <!-- Menu -->
    <div class="relative w-4">
      <IconButton class="text-xl" active icon="carbon:overflow-menu-vertical" title="Menu" />
      <select v-model="menu" class="absolute text-base top-0 bottom-0 left-0 right-0 opacity-0">
        <optgroup label="Size">
          <option value="small">Small</option>
          <option value="large">Large</option>
          <option value="list">List</option>
        </optgroup>
        <optgroup label="Actions">
          <option value="select">Select mutiple</option>
        </optgroup>

        <!--
          TODO: due to this function requires to download and pack
                the full set, we should make some UI to aware users
                in browser version.
        -->
        <optgroup label="Downloads">
          <option v-if="!isElectron && !installed" value="cache">Cache in Browser</option>
          <option value="download_iconfont" :disabled="inProgress">Iconfont</option>
          <option value="download_svgs" :disabled="inProgress">SVGs Zip</option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<script lang='ts'>
import { defineComponent, PropType, ref, watch, nextTick, computed } from 'vue'
import { iconSize, listType, selectingMode, inProgress, progressMessage } from '../store'
import { CollectionMeta, downloadAndInstall, isInstalled } from '../data'
import { PackIconFont, PackSvgZip } from '../utils/pack'
import { isElectron } from '../env'

export default defineComponent({
  props: {
    collection: {
      type: Object as PropType<CollectionMeta>,
    },
  },
  setup(props) {
    const menu = ref(
      listType.value === 'list'
        ? 'list'
        : iconSize.value === '2xl'
          ? 'small'
          : 'large',
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

      progressMessage.value = 'Downloading...'
      inProgress.value = true
      await nextTick()
      await downloadAndInstall(props.collection.id)
      inProgress.value = false
    }

    watch(
      menu,
      async(current, prev) => {
        switch (current) {
          case 'small':
            iconSize.value = '2xl'
            listType.value = 'grid'
            return
          case 'large':
            iconSize.value = '4xl'
            listType.value = 'grid'
            return
          case 'list':
            iconSize.value = '3xl'
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

    return {
      inProgress,
      menu,
      listType,
      iconSize,
      selectingMode,
      isElectron,
      installed: computed(() => props.collection && isInstalled(props.collection.id)),
    }
  },
})
</script>
