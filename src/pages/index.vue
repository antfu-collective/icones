<script setup lang='ts'>
import type { PresentType } from '../data'
import { sortAlphabetically } from '../store'
import { categories, categorySearch, favoritedCollections, filteredCollections, recentCollections } from '../data'

const input = ref<HTMLInputElement>()
const categorized = computed(() => [
  {
    name: 'Favorites',
    type: 'favorite' as PresentType,
    collections: favoritedCollections.value,
  },
  {
    name: 'Recent',
    type: 'recent' as PresentType,
    collections: recentCollections.value,
  },
  ...categories.map(category => ({
    name: category,
    type: 'normal' as PresentType,
    collections: filteredCollections.value.filter(collection => collection.category === category),
  })),
])

const router = useRouter()
onKeyStroke('/', () => router.replace('/collection/all'))
onMounted(() => input.value?.focus())
</script>

<template>
  <WithNavbar>
    <NavPlaceholder class="sm:border-b border-base text-center m-auto flex font-light h-37px">
      <div class="m-auto">
        Icônes
      </div>
    </NavPlaceholder>

    <!-- Searching -->
    <div class="border-b py-3 md:mx-6 mb-2 md:mt-6 flex md:shadow md:rounded outline-none md:py-1 px-4 md:border md:border-transparent dark:border-dark-200">
      <Icon icon="carbon:search" class="m-auto flex-none opacity-60" />
      <form action="/collection/all" class="flex-auto" role="search" method="get" @submit.prevent>
        <input
          ref="input"
          v-model="categorySearch"
          aria-label="Search"
          class="text-base outline-none w-full py-1 px-4 m-0 bg-transparent"
          name="s"
          placeholder="Search category..."
          autofocus
          autocomplete="off"
        >
      </form>

      <button class="flex items-center opacity-60 hover:opacity-80">
        <Icon v-if="categorySearch" icon="carbon:close" class="m-auto text-lg -mr-1" @click="categorySearch = ''" />
      </button>
      <button
        class="flex items-center transition ml-4"
        :class="{
          'opacity-50 hover:opacity-70': sortAlphabetically,
          'opacity-30 hover:opacity-50': !sortAlphabetically,
        }"
        @click="sortAlphabetically = !sortAlphabetically"
      >
        <Icon
          icon="mdi:sort-alphabetical-ascending"
          class="m-auto text-lg -mr-1 "
        />
      </button>
    </div>

    <!-- Category listing -->
    <template v-for="c of categorized" :key="c.name">
      <div v-if="(c.collections).length" px4>
        <div px-2 op50 mt6 text-lg>
          {{ c.name }}
        </div>
        <CollectionEntries
          of-hidden
          :collections="c.collections"
          :type="c.type"
        />
      </div>
    </template>

    <div
      v-if="categorized.every(c => !c.collections.length)"
      class="flex flex-col flex-grow w-full py-6 justify-center items-center"
    >
      <Icon icon="ph:x-circle-bold" class="text-4xl mb-2 opacity-20" />
      <span class="text-lg opacity-60">There is no result corresponding to your search query.</span>
    </div>
    <Footer />
  </WithNavbar>
</template>
