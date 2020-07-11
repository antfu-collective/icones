<template>
  <div class="p-5">
    <div>
      <div class="text-gray-900 text-lg">
        {{ collection.name }}
      </div>
      <a
        class="text-gray-500 text-sm block leading-none hover:text-gray-900"
        :href="collection.url"
      >{{ collection.author }}</a>
      <a
        class="text-gray-500 text-xs block mt-3 hover:text-gray-900"
        :href="collection.licenseURL"
        target="_blank"
      >{{ collection.license }}</a>
      <div class="text-gray-500 text-xs block">
        {{ collection.icons.length }} icons
      </div>
      <div class="flex mt-6">
        <input
          v-model="search"
          class="shadow rounded outline-none py-2 px-4 flex-auto"
          placeholder="Search..."
        >
      </div>
    </div>
    <div class="py-4 text-center">
      <Icons :icons="icons.slice(0, max)" :selected="[selected]" @select="onSelect" />
      <button v-if="icons.length > max" class="btn m-2" @click="loadMore">
        Load More
      </button>
    </div>
    <p class="text-gray-500 text-sm px-2">
      Icons: {{ icons.length }}
    </p>

    <Modal :value="!!selected" @close="selected = null">
      <IconDetail :icon="selected" />
    </Modal>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { collections, all } from '../data'
import Icon from '../components/Icon.vue'
import IconButton from '../components/IconButton.vue'
import Icons from '../components/Icons.vue'
import Modal from '../components/Modal.vue'
import IconDetail from '../components/IconDetail.vue'

export default defineComponent({
  components: {
    Icon,
    IconButton,
    Icons,
    Modal,
    IconDetail,
  },
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const search = ref('')
    const selected = ref<string | null>(null)
    const max = ref(200)

    const collection = props.id === 'all'
      ? all
      : collections.find(c => c.id === props.id)!

    const icons = computed(() => {
      const searchString = search.value.trim().toLowerCase()
      if (!searchString)
        return collection.icons
      else
        return collection.icons.filter(i => i.includes(searchString))
    })

    const onSelect = (icon: string) => {
      selected.value = icon
    }

    const loadMore = () => {
      max.value += 100
    }

    return {
      selected,
      search,
      collection,
      icons,
      onSelect,
      max,
      loadMore,
    }
  },
})
</script>
