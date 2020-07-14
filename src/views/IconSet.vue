<template>
  <WithNavbar nav-class="md:hidden">
    <div class="py-5 px-5 md:px-8">
      <div class="flex">
        <!-- Left -->
        <div class="flex-auto">
          <div class="text-gray-900 text-xl flex">
            {{ collection.name }}
            <a
              v-if="collection.url"
              class="text-gray-500 hover:text-gray-900 mt-1 text-base"
              :href="collection.url"
              target="_blank"
            >
              <Icon icon="la:external-link-square-alt-solid" />
            </a>
            <div class="flex-auto" />
          </div>
          <div class="text-gray-500 text-xs block">
            {{ collection.author }}
          </div>
          <div>
            <a
              class="text-gray-500 text-xs hover:text-gray-900"
              :href="collection.licenseURL"
              target="_blank"
            >{{ collection.license }}</a>
          </div>
        </div>

        <!-- Right -->
        <div class="px-1 text-xl text-gray-800">
          <IconButton
            class="inline-block ml-3"
            icon="carbon:hinton-plot"
            :active="listType === 'grid' && iconSize === '2xl'"
            @click="()=>setGrid('small')"
          />
          <IconButton
            class="inline-block ml-3"
            icon="carbon:app-switcher"
            :active="listType === 'grid' && iconSize === '4xl'"
            @click="()=>setGrid('large')"
          />
          <IconButton
            class="inline-block ml-3"
            icon="carbon:list"
            :active="listType === 'list'"
            @click="()=>setGrid('list')"
          />
        </div>
      </div>

      <!-- Search -->
      <div class="flex mt-4">
        <input
          v-model="search"
          class="shadow rounded outline-none py-2 px-4 flex-auto"
          placeholder="Search..."
        >
      </div>

      <!-- Icons -->
      <div class="py-4 text-center">
        <Icons
          :icons="icons.slice(0, max)"
          :selected="[selected]"
          :size="iconSize"
          :display="listType"
          :search="search"
          @select="onSelect"
        />
        <button v-if="icons.length > max" class="btn m-2" @click="loadMore">
          Load More
        </button>
        <p class="text-gray-500 text-sm px-2">
          {{ icons.length }} icons
        </p>
      </div>

      <Footer />

      <Modal :value="!!selected" @close="selected = null">
        <IconDetail :icon="selected" />
      </Modal>
    </div>
  </WithNavbar>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { collections, all } from '../data'
import { iconSize, listType } from '../store'

export default defineComponent({
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

    const collection = computed(() => {
      return props.id === 'all'
        ? all
        : collections.find(c => c.id === props.id)!
    })

    const icons = computed(() => {
      const searchString = search.value.trim().toLowerCase()
      if (!searchString) return collection.value.icons
      else return collection.value.icons.filter(i => i.includes(searchString))
    })

    const onSelect = (icon: string) => {
      selected.value = icon
    }

    const loadMore = () => {
      max.value += 100
    }

    const setGrid = (type: string) => {
      switch (type) {
        case 'small':
          iconSize.value = '2xl'
          listType.value = 'grid'
          break
        case 'large':
          iconSize.value = '4xl'
          listType.value = 'grid'
          break
        default :
          iconSize.value = '3xl'
          listType.value = 'list'
      }
    }

    return {
      selected,
      search,
      collection,
      icons,
      onSelect,
      max,
      loadMore,
      iconSize,
      listType,
      setGrid,
    }
  },
})
</script>
