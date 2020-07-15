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
          <template v-if="collection.categories">
            <IconButton
              class="inline-block mr-3"
              icon="carbon:categories"
              :active="showCategories"
              @click="showCategories = !showCategories"
            />
            <div class="mx-2 py-1 bg-gray-400 inline-block" style="width:1px;height:1em" />
          </template>
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

      <!-- Categories -->
      <div class="py-2">
        <template v-if="collection.categories && showCategories">
          <div
            v-for="c of Object.keys(collection.categories)"
            :key="c"
            class="text-sm inline-block px-2 border border-gray-200 text-gray-500 rounded-full m-1 hover:bg-gray-100 cursor-pointer"
            :class="c === category ? 'text-primary border-primary' : ''"
            @click="toggleCategory(c)"
          >
            {{ c }}
          </div>
        </template>
      </div>

      <!-- Search -->
      <div class="flex">
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
          :namespace="id==='all' ? '' : `${id}:`"
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
import { defineComponent, ref, toRefs } from 'vue'
import { iconSize, listType, showCategories } from '../store'
import { useSearch } from '../hooks/search'

export default defineComponent({
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { id } = toRefs(props)
    const { search, icons, collection, category } = useSearch(id)

    const selected = ref<string | null>(null)
    const max = ref(200)

    const toggleCategory = (cat: string) => {
      if (category.value === cat)
        category.value = ''
      else
        category.value = cat
    }

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
      category,
      loadMore,
      iconSize,
      listType,
      setGrid,
      toggleCategory,
      showCategories,
    }
  },
})
</script>
