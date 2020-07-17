<template>
  <WithNavbar v-if="!collection">
    <div class="py-8 px-4 text-gray-700 text-center">Loading...</div>
  </WithNavbar>
  <IconSet v-else :collection="collection"/>
</template>

<script lang='ts'>
import { defineComponent, ref, watch, onUnmounted } from 'vue'
import {
  isMetaLoaded,
  isInstalled,
  getFullMeta,
  install,
  getMeta,
  CollectionMeta
} from '../data'
import IconSet from './IconSet.vue'
import { useCurrentCollection, setCurrentCollection } from '../store'

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
    watch(
      () => props.id,
      () => {
        setCurrentCollection(props.id)
      },
      { immediate: true }
    )

    onUnmounted(() => {
      setCurrentCollection('')
    })

    return {
      collection: useCurrentCollection()
    }
  }
})
</script>
