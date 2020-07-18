<template>
  <WithNavbar>
    <div class="flex flex-auto h-full overflow-hidden">
      <Drawer class="h-full overflow-auto flex-none hidden md:block" style="width:280px" />
      <div v-if="collection" class="py-5 px-5 md:px-8 h-full overflow-y-auto flex-auto overflow-x-hidden">
        <div class="flex px-2">
          <!-- Left -->
          <div class="flex-auto px-2">
            <NavPlaceholder class="md:hidden" />

            <div class="text-gray-900 text-xl flex select-none">
              <div class="whitespace-no-wrap overflow-hidden">
                {{ collection.name }}
              </div>
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
            <ActionsMenu :collection="collection" />
            <div class="flex-auto" />
          </div>
        </div>

        <!-- Categories -->
        <div class="py-2 px-1 pr-3 overflow-x-auto flex flex-no-wrap select-none">
          <template v-if="collection.categories">
            <div
              v-for="c of Object.keys(collection.categories)"
              :key="c"
              class="whitespace-no-wrap text-sm inline-block px-2 border border-gray-200 text-gray-500 rounded-full m-1 hover:bg-gray-100 cursor-pointer"
              :class="c === category ? 'text-primary border-primary' : ''"
              @click="toggleCategory(c)"
            >
              {{ c }}
            </div>
          </template>
        </div>

        <!-- Icons -->
        <div class="pt-2 pb-4 text-center">
          <Icons
            :icons="icons.slice(0, max)"
            :selected="bags"
            :size="iconSize"
            :display="listType"
            :search="search"
            :namespace="namespace"
            style="color: #666"
            @select="onSelect"
          />
          <button v-if="icons.length > max" class="btn m-2" @click="loadMore">
            Load More
          </button>
          <p class="text-gray-500 text-sm pt-4">
            {{ icons.length }} icons
          </p>
        </div>

        <Footer />

        <!-- Bag -->
        <Modal :value="showBag" direction="right" @close="showBag = false">
          <Bag
            @close="showBag = false"
            @select="e => current = e"
          />
        </Modal>

        <!-- Details -->
        <Modal :value="!!current" @close="current = ''">
          <IconDetail :icon="current" @close="current = ''" />
        </Modal>

        <!-- Bag Fab -->
        <FAB
          v-if="bags.length"
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
    </div>
  </WithNavbar>
</template>

<script lang='ts'>
import { defineComponent, ref, computed, PropType } from 'vue'
import { iconSize, listType, selectingMode, bags, toggleBag, getSearchResults } from '../store'
import { CollectionMeta } from '../data'
import { isElectron } from '../env'

export default defineComponent({
  props: {
    collection: {
      type: Object as PropType<CollectionMeta>,
      required: true,
    },
  },
  setup(props) {
    const { search, icons, category, collection } = getSearchResults()
    const showBag = ref(false)

    const current = ref<string>('')
    const max = ref(isElectron ? 500 : 200)

    const toggleCategory = (cat: string) => {
      if (category.value === cat) category.value = ''
      else category.value = cat
    }

    const namespace = computed(() => {
      return !collection.value || collection.value.id === 'all'
        ? ''
        : `${collection.value.id}:`
    })

    const onSelect = (icon: string) => {
      if (selectingMode.value) toggleBag(icon)
      else current.value = icon
    }

    const selectedIcons = computed(() => {
      if (selectingMode.value) return bags.value
      else return current.value ? [] : [current.value]
    })

    const loadMore = () => {
      max.value += 100
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
      namespace,
      selectedIcons,

      // cates
      toggleCategory,

      // bags
      showBag,
      bags,
      selectingMode,
    }
  },
})
</script>
