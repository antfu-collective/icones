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
        <div class="flex flex-col">
          <div class="px-1 text-xl text-gray-800 flex">
            <IconButton
              class="hidden md:block mr-3"
              icon="carbon:checkbox-checked"
              :active="selectingMode"
              @click="selectingMode = !selectingMode"
            />
            <div class="hidden md:block mx-1 h-full m-auto bg-gray-200" style="width:1px;" />
            <template v-if="collection.categories">
              <IconButton
                class="mx-3"
                icon="carbon:categories"
                :active="showCategories"
                title="Categories"
                @click="showCategories = !showCategories"
              />
              <div class="mx-1 m-auto h-full bg-gray-200" style="width:1px;" />
            </template>
            <IconButton
              class="ml-3"
              icon="carbon:hinton-plot"
              title="Small"
              :active="listType === 'grid' && iconSize === '2xl'"
              @click="()=>setGrid('small')"
            />
            <IconButton
              class="ml-3"
              icon="carbon:app-switcher"
              title="Large"
              :active="listType === 'grid' && iconSize === '4xl'"
              @click="()=>setGrid('large')"
            />
            <IconButton
              class="ml-3"
              icon="carbon:list"
              title="List View"
              :active="listType === 'list'"
              @click="()=>setGrid('list')"
            />
          </div>
          <div class="flex-auto" />
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
          :selected="selectedIcons"
          :size="iconSize"
          :display="listType"
          :search="search"
          :namespace="namespace"
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

      <!-- Details -->
      <Modal :value="!!current" @close="current = null">
        <IconDetail :icon="current" />
      </Modal>

      <!-- Bag -->
      <Modal :value="showBag" direction="right" @close="showBag = false">
        <Bag @close="showBag = false" />
      </Modal>

      <!-- Bag Fab -->
      <FAB
        icon="carbon:shopping-bag"
        :number="bags.length"
        @click="showBag = true"
      />

      <!-- Selecting Note -->
      <div
        class="fixed top-0 right-0 pl-4 pr-2 py-1 rounded-l-full bg-primary text-white shadow mt-16 cursor-pointer transition-transform duration-300 ease-in-out"
        :style="selectingMode ? {} : {transform: 'translateX(120%)'}"
        @click="selectingMode = false"
      >
        Selecting Mode
        <Icon icon="carbon:close" class="inline-block text-xl align-text-bottom" />
      </div>
    </div>
  </WithNavbar>
</template>

<script lang='ts'>
import { defineComponent, ref, toRefs, computed } from 'vue'
import { iconSize, listType, showCategories, selectingMode, bags, toggleBag } from '../store'
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
    const showBag = ref(false)

    const current = ref<string | null>(null)
    const max = ref(200)

    const toggleCategory = (cat: string) => {
      if (category.value === cat)
        category.value = ''
      else
        category.value = cat
    }

    const namespace = computed(() => {
      return props.id === 'all' ? '' : `${props.id}:`
    })

    const onSelect = (icon: string) => {
      if (selectingMode.value)
        toggleBag(icon)
      else
        current.value = icon
    }

    const selectedIcons = computed(() => {
      if (selectingMode.value)
        return bags.value
      else
        return current.value ? [] : [current.value]
    })

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
      current,
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
      namespace,
      selectedIcons,

      // cates
      toggleCategory,
      showCategories,

      // bags
      showBag,
      bags,
      selectingMode,
    }
  },
})
</script>
