<template>
  <WithNavbar v-if="!collection">
    <div class="py-8 px-4 text-gray-700 text-center">Loading...</div>
  </WithNavbar>
  <IconSet v-else :collection="collection" :installed="installed" />
</template>

<script lang='ts'>
import { defineComponent, ref, watch } from 'vue'
import {
  isMetaLoaded,
  isInstalled,
  getFullMeta,
  install,
  getMeta,
  CollectionMeta
} from '../data'
import IconSet from './IconSet.vue'

export default defineComponent({
  components: {
    IconSet
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const loaded = ref(isMetaLoaded(props.id))
    const installed = ref(isInstalled(props.id))
    const collection = ref<CollectionMeta | null>(null)

    watch(
      () => props.id,
      async () => {
        loaded.value = false

        if (props.id === 'all') {
          const meta = await getFullMeta()
          collection.value = {
            id: 'all',
            name: 'All',
            icons: meta.flatMap(c => c.icons.map(i => `${c.id}:${i}`))
          }
        } else {
          await install(props.id)
          collection.value = await getMeta(props.id)
        }
        loaded.value = true
      },
      { immediate: true }
    )

    return {
      collection,
      loaded,
      installed
    }
  }
})
</script>
