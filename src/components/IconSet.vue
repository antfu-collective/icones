<!-- eslint-disable no-console -->
<script setup lang='ts'>
import { cacheCollection, specialTabs } from '../data'
import { isLocalMode } from '../env'
import { activeMode, bags, drawerCollapsed, getSearchResults, iconSize, isCurrentCollectionLoading, listType, showHelp, toggleBag } from '../store'
import { getIconSnippet } from '../utils/icons'
import { searchIconAi } from '../utils/iconSearchAi'
import { cleanupQuery } from '../utils/query'

const route = useRoute()
const router = useRouter()

const showBag = ref(false)
const copied = ref(false)
const current = computed({
  get() {
    return (route.query.icon as string) || ''
  },
  set(value) {
    router.replace({ query: cleanupQuery({ ...route.query, icon: value }) })
  },
})
const max = ref(isLocalMode ? 500 : 200)
const searchbar = ref<{ input: HTMLElement }>()

const { search, icons, category, collection, variant } = getSearchResults()
const loading = isCurrentCollectionLoading()

const maxMap = new Map<string, number>()
const id = computed(() => collection.value?.id)
const url = computed(() => collection.value?.url || collection.value?.author?.url)
const npm = computed(() => (id.value != null && !specialTabs.includes(id.value)) ? `https://www.npmjs.com/package/@iconify-json/${id.value}` : '')
const namespace = computed(() => (id.value != null && !specialTabs.includes(id.value)) ? `${id.value}:` : '')

function onCopy(status: boolean) {
  copied.value = status
  setTimeout(() => {
    copied.value = false
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
    catch {
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
      onCopy(await copyText(await getIconSnippet(
        [collection.value!],
        icon,
        'id',
        true,
      ) || icon))
      break
    default:
      current.value = icon
      break
  }
}

function loadMore() {
  max.value += 100
  maxMap.set(namespace.value, max.value)
}

async function loadAll() {
  if (!namespace.value)
    return

  await cacheCollection(collection.value!.id)
  max.value = icons.value.length
  maxMap.set(namespace.value, max.value)
}

function next(delta = 1) {
  const name = current.value.startsWith(namespace.value)
    ? current.value.slice(namespace.value.length)
    : current.value
  const index = icons.value.indexOf(name)
  if (index === -1)
    return
  const newOne = icons.value[index + delta]
  if (newOne)
    current.value = namespace.value + newOne
}

watch(
  () => namespace.value,
  () => max.value = maxMap.get(namespace.value) || 200,
)

function focusSearch() {
  searchbar.value?.input.focus()
}

onMounted(focusSearch)
watch(router.currentRoute, focusSearch, { immediate: true })

router.afterEach(() => {
  focusSearch()
})

onKeyStroke('/', (e) => {
  e.preventDefault()
  focusSearch()
})

onKeyStroke('Escape', () => {
  if (current.value !== '') {
    current.value = ''
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

// ------------ AI Search ------------
const aiquery = ref('')
const results = ref()
const loadingSearchAi = ref(false)
const hide = ref(true)
async function searchIcon(aiquery: string, prefix: string, collectionName: string) {
  if (!aiquery.trim()) {
    results.value = []
    return
  }
  hide.value = false
  loadingSearchAi.value = true
  results.value = []
  try {
    const res = await searchIconAi(aiquery, prefix, collectionName)
    results.value = Array.isArray(res) ? res : []
  }
  catch (e) {
    console.error('AI search failed:', e)
    results.value = []
    hide.value = true
  }
  finally {
    loadingSearchAi.value = false
  }
}
</script>

<template>
  <WithNavbar>
    <div class="flex flex-auto h-full overflow-hidden">
      <Drawer
        h-full overflow-y-overlay flex-none hidden md:block :w="drawerCollapsed ? '0px' : '250px'" transition-all
        duration-300
      />

      <button
        fixed top="50%" flex="~ items-end justify-center" w-5 h-8 icon-button transition-all duration-300
        border="t r b base rounded-r-full" z-10 max-md:hidden title="Toggle Sidebar"
        :style="{ left: drawerCollapsed ? '0px' : '250px' }" @click="drawerCollapsed = !drawerCollapsed"
      >
        <div
          i-carbon-chevron-left icon-button ml--1 transition duration-300 ease-in-out
          :class="drawerCollapsed ? 'transform rotate-180' : ''"
        />
      </button>

      <!-- Loading -->
      <div
        v-if="collection && loading"
        class="h-full w-full flex-auto relative bg-base bg-opacity-75 content-center transition-opacity duration-100"
        :class="loading ? '' : 'opacity-0 pointer-events-none'"
      >
        <div class="absolute text-gray-800 dark:text-dark-500" style="top:50%;left:50%;transform:translate(-50%,-50%)">
          Loading...
        </div>
      </div>

      <div v-else-if="collection" h-full w-full relative max-h-full grid="~ rows-[max-content_1fr]" of-hidden>
        <div pt-5 flex="~ col gap-2">
          <div class="flex px-8">
            <!-- Left -->
            <div class="flex-auto px-2">
              <NavPlaceholder class="md:hidden" />

              <div class="text-gray-900 text-xl flex select-none dark:text-gray-200">
                <div class="whitespace-no-wrap overflow-hidden">
                  {{ collection.name }}
                </div>
                <a v-if="url" class="ml-1 mt-1 text-base opacity-25 hover:opacity-100" :href="url" target="_blank">
                  <Icon icon="la:external-link-square-alt-solid" />
                </a>
                <a v-if="npm" class="ml-1 mt-1 text-base opacity-25 hover:opacity-100" :href="npm" target="_blank">
                  <Icon icon="la:npm" />
                </a>
                <div class="flex-auto" />
              </div>
              <div class="text-xs block opacity-50">
                {{ collection.author?.name }}
              </div>
              <div v-if="collection.license">
                <a class="text-xs opacity-50 hover:opacity-100" :href="collection.license.url" target="_blank">{{
                  collection.license.title }}</a>
              </div>
            </div>

            <!-- Right -->
            <div class="flex flex-col">
              <ActionsMenu :collection="collection" />
              <div class="flex-auto" />
            </div>
          </div>

          <!-- Categories -->
          <div v-if="collection.categories" ref="categoriesContainer" class="mx-8 flex flex-wrap gap-2 select-none">
            <div
              v-for="c of Object.keys(collection.categories).sort()" :key="c" class="
                whitespace-nowrap text-sm inline-block px-2 border border-base rounded-full hover:bg-gray-50 cursor-pointer
                dark:border-dark-200 dark:hover:bg-dark-200
              " :class="c === category ? 'text-primary border-primary dark:border-primary' : 'opacity-75'"
              @click="toggleCategory(c)"
            >
              {{ c }}
            </div>
          </div>

          <!-- Searching -->
          <div flex justify-between px8 gap-2>
            <SearchBar ref="searchbar" v-model:search="search" class=" hidden md:flex w-full" />

            <!---- AI Searching -->
            <div class="relative  flex items-center gap-2 w-full  border border-base rounded bg-transparent shadow ">
              <span class="p-1 px-2 text-gray-500 i-hugeicons-ai-search text-lg mx-2" />

              <input
                v-model="aiquery" type="search" placeholder="Describe an icon in words..."
                class="text-base bg-transparent outline-none w-full  py-1 m-0 "
              >
              <button
                class="mx-1 px-4 rounded-lg text-gray-500  hover:bg-neutral-200"
                @click="searchIcon(aiquery, collection.id, collection.name)"
              >
                Search
              </button>
              <button
                :class="hide && results ? 'i-carbon-chevron-down' : 'i-carbon-chevron-up'"
                class="icon-button text-xl mr-2  px-1  rounded-lg text-gray-500  hover:bg-neutral-200"
                @click="hide = !hide"
              />

              <Transition
                enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 -translate-y-2" enter-to-class="opacity-100 translate-y-0"
                leave-active-class="transition-all duration-300 ease-in" leave-from-class="opacity-100 translate-y-0"
                leave-to-class="opacity-0 -translate-y-2"
              >
                <div
                  v-show="!hide && aiquery" v-if="results"
                  class="absolute flex overflow-x-auto gap-2 bg-white/80 border dark:border-neutral-800 backdrop-blur-lg dark:bg-black/30 top-12 z-36 w-full p-4 rounded-lg shadow dark:text-white"
                >
                  <div v-if="loadingSearchAi">
                    <svg
                      xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                      viewBox="0 0 24 24"
                    ><!-- Icon from Material Line Icons by Vjacheslav Trushkin - https://github.com/cyberalien/line-md/blob/master/license.txt -->
                      <g
                        fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                        stroke-width="2"
                      >
                        <path stroke-dasharray="16" stroke-dashoffset="16" d="M12 3c4.97 0 9 4.03 9 9">
                          <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.3s" values="16;0" />
                          <animateTransform
                            attributeName="transform" dur="1.5s" repeatCount="indefinite" type="rotate"
                            values="0 12 12;360 12 12"
                          />
                        </path>
                        <path
                          stroke-dasharray="64" stroke-dashoffset="64" stroke-opacity=".3"
                          d="M12 3c4.97 0 9 4.03 9 9c0 4.97 -4.03 9 -9 9c-4.97 0 -9 -4.03 -9 -9c0 -4.97 4.03 -9 9 -9Z"
                        >
                          <animate fill="freeze" attributeName="stroke-dashoffset" dur="1.2s" values="64;0" />
                        </path>
                      </g>
                    </svg>
                  </div>
                  <div
                    v-for="(r, index) in results" v-else :key="index" class="
                whitespace-nowrap text-sm inline-block px-2 border border-base rounded-full hover:bg-gray-50 cursor-pointer
                dark:border-dark-200 dark:hover:bg-dark-200
              " @click="search = r"
                  >
                    {{ r }}
                  </div>
                </div>
              </Transition>
            </div>
          </div>
          <!-- Variants --->
          <div v-if="collection.variants" class="mx-8 mb-2 flex flex-wrap gap-2 select-none items-center">
            <div text-sm op50>
              Variants
            </div>
            <div
              v-for="c of Object.keys(collection.variants).sort()" :key="c" class="
                whitespace-nowrap text-sm inline-block px-2 border border-base rounded-full hover:bg-gray-50 cursor-pointer
                dark:border-dark-200 dark:hover:bg-dark-200
              " :class="c === variant ? 'text-primary border-primary dark:border-primary' : 'opacity-75'"
              @click="toggleVariant(c)"
            >
              {{ c }}
            </div>
          </div>
        </div>
        <div of-y-scroll of-x-hidden>
          <!-- Icons -->
          <div class="px-5 pt-2 pb-4 text-center">
            <Icons
              :icons="icons.slice(0, max)" :selected="bags" :class="iconSize" :display="listType" :search="search"
              :namespace="namespace" @select="onSelect"
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
        </div>
      </div>

      <template v-if="collection">
        <!-- Bag Fab -->
        <FAB v-if="bags.length" icon="carbon:shopping-bag" :number="bags.length" @click="showBag = true" />

        <!-- Bag -->
        <Modal :value="showBag" direction="right" @close="showBag = false">
          <Bag @close="showBag = false" @select="onSelect" />
        </Modal>

        <!-- Details -->
        <Modal :value="!!current" @close="current = ''">
          <IconDetail
            :icon="current" :show-collection="specialTabs.includes(collection.id)" @close="current = ''"
            @copy="onCopy" @next="next(1)" @prev="next(-1)"
          />
        </Modal>

        <!-- Help -->
        <ModalDialog :value="showHelp" @close="showHelp = false">
          <HelpPage />
        </ModalDialog>

        <!-- Mode -->
        <div
          class="fixed top-0 right-0 pl-4 pr-2 py-1 rounded-l-full bg-primary text-white shadow mt-16 cursor-pointer transition-transform duration-300 ease-in-out"
          :style="activeMode !== 'normal' ? {} : { transform: 'translateX(120%)' }" @click="activeMode = 'normal'"
        >
          {{ activeMode === 'select' ? 'Multiple select' : 'Name copying mode' }}
          <Icon icon="carbon:close" class="inline-block text-xl align-text-bottom" />
        </div>

        <SearchElectron />

        <Notification :value="copied">
          <Icon icon="mdi:check" class="inline-block mr-2 font-xl align-middle" />
          <span class="align-middle">Copied</span>
        </Notification>
      </template>
    </div>
  </WithNavbar>
</template>
