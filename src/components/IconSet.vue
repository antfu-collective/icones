<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { useRoute, useRouter } from 'vue-router'
import { activeMode, bags, getSearchResults, iconSize, isCurrentCollectionLoading, listType, showHelp, toggleBag } from '../store'
import { isLocalMode } from '../env'
import { cacheCollection, specialTabs } from '../data'
import { getIconSnippet } from '../utils/icons'

const showBag = $ref(false)
let copied = $ref(false)
let current = $ref('')
let max = $ref(isLocalMode ? 500 : 200)
const searchbar = ref<{ input: HTMLElement }>()

const route = useRoute()
const router = useRouter()

const { search, icons, category, collection, variant } = getSearchResults()
const loading = isCurrentCollectionLoading()

const maxMap = new Map<string, number>()
const id = $computed(() => collection.value?.id)
const url = $computed(() => collection.value?.url || collection.value?.author?.url)
const npm = $computed(() => (id != null && !specialTabs.includes(id)) ? `https://www.npmjs.com/package/@iconify-json/${id}` : '')
const namespace = $computed(() => (id != null && !specialTabs.includes(id)) ? `${id}:` : '')

function onCopy(status: boolean) {
  copied = status
  setTimeout(() => {
    copied = false
  }, 2000)
}

function toggleCategory(cat: string) {
  if (category.value === cat)
    category.value = ''
  else
    category.value = cat
}

function toggleVariant(v: string) {
  if (variant.value === v)
    variant.value = ''
  else
    variant.value = v
}

async function copyText(text?: string) {
  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch (err) {
    }
  }
  return false
}

async function onSelect(icon: string) {
  switch (activeMode.value) {
    case 'select':
      toggleBag(icon)
      break
    case 'copy':
      onCopy(await copyText(await getIconSnippet(icon, 'id', true) || icon))
      break
    default:
      current = icon
      break
  }
}

function loadMore() {
  max += 100
  maxMap.set(namespace, max)
}

async function loadAll() {
  if (!namespace)
    return

  await cacheCollection(collection.value!.id)
  max = icons.value.length
  maxMap.set(namespace, max)
}

function next(delta = 1) {
  const name = current.startsWith(namespace) ? current.slice(namespace.length) : current
  const index = icons.value.indexOf(name)
  if (index === -1)
    return
  const newOne = icons.value[index + delta]
  if (newOne)
    current = namespace + newOne
}

watch(
  () => namespace,
  () => max = maxMap.get(namespace) || 200,
)

onMounted(() => {
  search.value = route.query.s as string || ''
  watch([search, collection], () => {
    if (search.value)
      router.replace({ query: { s: search.value } })
  })
})

function focusSearch() {
  searchbar.value?.input.focus()
}

onMounted(focusSearch)
watch(router.currentRoute, focusSearch, { immediate: true })

router.afterEach((to) => {
  if (to.path === '/')
    search.value = ''
  focusSearch()
})

onKeyStroke('/', (e) => {
  e.preventDefault()
  focusSearch()
})

onKeyStroke('Escape', () => {
  if (current !== '') {
    current = ''
    focusSearch()
  }
})

const categoriesContainer = ref<HTMLElement | null>(null)
const { x } = useScroll(categoriesContainer)
useEventListener(categoriesContainer, 'wheel', (e: WheelEvent) => {
  e.preventDefault()
  if (e.deltaX)
    x.value += e.deltaX
  else
    x.value += e.deltaY
}, {
  passive: false,
})
</script>

<template>
  <WithNavbar>
    <div class="flex flex-auto h-full overflow-hidden ">
      <Drawer class="h-full overflow-y-overlay flex-none hidden md:block" style="width:220px; position: relative; z-index: 1;" />
      <div v-if="collection" class="py-5 h-full flex-auto overflow-x-hidden relative" style="overflow-x: visible;">
        <!-- Loading -->
        <div
          class="absolute top-0 left-0 right-0 bottom-0 bg-white bg-opacity-75 content-center transition-opacity duration-100 z-50 dark:bg-dark-100"
          :class="loading ? '' : 'opacity-0 pointer-events-none'"
        >
          <div class="absolute text-gray-800 dark:text-dark-500" style="top:50%;left:50%;transform:translate(-50%,-50%)">
            Loading...
          </div>
        </div>

        <div class="flex px-8">
          <!-- Left -->
          <div class="flex-auto px-2">
            <NavPlaceholder class="md:hidden" />

            <div class="text-gray-900 text-xl flex select-none dark:text-gray-200">
              <div class="whitespace-no-wrap overflow-hidden">
                {{ collection.name }}
              </div>
              <a
                v-if="url"
                class="ml-1 mt-1 text-base opacity-25 hover:opacity-100"
                :href="url"
                target="_blank"
              >
                <Icon icon="la:external-link-square-alt-solid" />
              </a>
              <a
                v-if="npm"
                class="ml-1 mt-1 text-base opacity-25 hover:opacity-100"
                :href="npm"
                target="_blank"
              >
                <Icon icon="la:npm" />
              </a>
              <div class="flex-auto" />
            </div>
            <div class="text-xs block opacity-50">
              {{ collection.author?.name }}
            </div>
            <div v-if="collection.license">
              <a
                class="text-xs opacity-50 hover:opacity-100"
                :href="collection.license.url"
                target="_blank"
              >{{ collection.license.title }}</a>
            </div>
          </div>

          <!-- Right -->
          <div class="flex flex-col">
            <ActionsMenu :collection="collection" />
            <div class="flex-auto" />
          </div>
        </div>

        <!-- Categories -->
        <div v-if="collection.categories" ref="categoriesContainer" class="py-1 mt2 mx-8 flex flex-wrap gap-2 select-none">
          <div
            v-for="c of Object.keys(collection.categories).sort()"
            :key="c"
            class="
                whitespace-nowrap text-sm inline-block px-2 border border-base rounded-full hover:bg-gray-50 cursor-pointer
                dark:border-dark-200 dark:hover:bg-dark-200
              "
            :class="c === category ? 'text-primary border-primary dark:border-primary' : 'opacity-75'"
            @click="toggleCategory(c)"
          >
            {{ c }}
          </div>
        </div>

        <!-- Searching -->
        <SearchBar
          ref="searchbar"
          v-model:search="search"
          class="mx-8 my-2 hidden md:flex"
        />

        <!-- Variants --->
        <div v-if="collection.variants" class="py1 mx-8 flex flex-wrap gap-2 select-none items-center">
          <div text-sm op50>
            Variants
          </div>
          <div
            v-for="c of Object.keys(collection.variants).sort()"
            :key="c"
            class="
                whitespace-nowrap text-sm inline-block px-2 border border-base rounded-full hover:bg-gray-50 cursor-pointer
                dark:border-dark-200 dark:hover:bg-dark-200
              "
            :class="c === variant ? 'text-primary border-primary dark:border-primary' : 'opacity-75'"
            @click="toggleVariant(c)"
          >
            {{ c }}
          </div>
        </div>

        <!-- Icons -->
        <div class="px-4 pt-2 pb-4 text-center">
          <Icons
            :icons="icons.slice(0, max)"
            :selected="bags"
            :class="iconSize"
            :display="listType"
            :search="search"
            :namespace="namespace"
            @select="onSelect"
          />
          <button v-if="icons.length > max" class="btn mx-1 my-3" @click="loadMore">
            Load More
          </button>
          <button v-if="icons.length > max && namespace" class="btn mx-1 my-3" @click="loadAll">
            Load All ({{ icons.length - max }})
          </button>
          <p class="color-fade text-sm pt-4">
            {{ icons.length }} icons
          </p>
        </div>

        <Footer />

        <!-- Bag Fab -->
        <FAB
          v-if="bags.length"
          icon="carbon:shopping-bag"
          :number="bags.length"
          @click="showBag = true"
        />

        <!-- Bag -->
        <Modal :value="showBag" direction="right" @close="showBag = false">
          <Bag
            @close="showBag = false"
            @select="onSelect"
          />
        </Modal>

        <!-- Details -->
        <Modal :value="!!current" @close="current = ''">
          <IconDetail
            :icon="current" :show-collection="specialTabs.includes(collection.id)"
            @close="current = ''"
            @copy="onCopy"
            @next="next(1)"
            @prev="next(-1)"
          />
        </Modal>

        <!-- Help -->
        <ModalDialog :value="showHelp" @close="showHelp = false">
          <HelpPage />
        </ModalDialog>

        <!-- Mode -->
        <div
          class="fixed top-0 right-0 pl-4 pr-2 py-1 rounded-l-full bg-primary text-white shadow mt-16 cursor-pointer transition-transform duration-300 ease-in-out"
          :style="activeMode !== 'normal' ? {} : { transform: 'translateX(120%)' }"
          @click="activeMode = 'normal'"
        >
          {{ activeMode === 'select' ? 'Multiple select' : 'Name copying mode' }}
          <Icon icon="carbon:close" class="inline-block text-xl align-text-bottom" />
        </div>

        <SearchElectron />

        <Notification :value="copied">
          <Icon icon="mdi:check" class="inline-block mr-2 font-xl align-middle" />
          <span class="align-middle">Copied</span>
        </Notification>
      </div>
    </div>
  </WithNavbar>
</template>
