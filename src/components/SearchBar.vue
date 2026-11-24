<script setup lang='ts'>
defineProps({
  search: {
    type: String,
    default: undefined,
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
  style: {
    type: Boolean,
    default: true,
  },
  border: {
    type: Boolean,
    default: true,
  },
  icon: {
    type: [String, Boolean],
    default: 'carbon:search',
  },
  inputClass: {
    type: String,
    default: '',
  },
  /**
   * Show a button that explains the search syntax
   */
  help: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:search', 'onKeydown'])

const input = ref<HTMLInputElement>()
defineExpose({ input })

function onKeydown(event: any) {
  emit('onKeydown', event)
}

const update = useDebounceFn((event: any) => {
  emit('update:search', event.target.value)
}, 250)

function clear() {
  emit('update:search', '')
}

// https://github.com/junegunn/fzf#search-syntax
const syntax = [
  ['home outline', 'both words'],
  ['home | house', 'either word'],
  ['\'home', 'exact match'],
  ['^home', 'starts with'],
  ['home$', 'ends with'],
  ['!outline', 'does not contain'],
]

const helpRoot = ref<HTMLElement>()
const showHelp = ref(false)
onClickOutside(helpRoot, () => showHelp.value = false)
</script>

<template>
  <div :class="style ? ['md:flex items-center outline-none py-1.5 md:py-1 px-4 transition-colors', { 'border border-base rounded-lg focus-within:border-primary/60': border }] : ''">
    <Icon v-if="icon" :icon="icon" class="m-auto flex-none opacity-60" />
    <form action="/collection/all" class="flex-auto" role="search" method="get" @submit.prevent>
      <input
        ref="input"
        :value="search"
        aria-label="Search"
        :class="inputClass"
        class="text-base outline-none w-full py-1 px-4 m-0 bg-transparent"
        name="s"
        :placeholder="placeholder"
        autofocus
        autocomplete="off"
        @input="update"
        @keydown="onKeydown"
      >
    </form>

    <button
      v-if="search"
      type="button"
      class="flex items-center opacity-60 hover:opacity-80"
      title="Clear search"
      aria-label="Clear search"
      @click="clear"
    >
      <Icon icon="carbon:close" class="m-auto text-lg -mr-1" aria-hidden="true" />
    </button>
    <div v-if="help" ref="helpRoot" class="relative flex items-center ml-3" @keydown.esc="showHelp = false">
      <button
        type="button"
        class="flex items-center opacity-60 hover:opacity-80"
        title="Search syntax"
        aria-label="Search syntax"
        :aria-expanded="showHelp"
        aria-controls="search-syntax"
        @click="showHelp = !showHelp"
      >
        <Icon icon="carbon:help" class="m-auto text-lg" aria-hidden="true" />
      </button>
      <div
        v-if="showHelp"
        id="search-syntax"
        class="absolute right-0 top-full mt-2 z-50 w-64 p-3 text-sm bg-base border border-base rounded-lg shadow-lg"
      >
        <table class="w-full">
          <tr v-for="[example, meaning] of syntax" :key="example">
            <td class="pr-3 py-0.5 whitespace-nowrap">
              <code class="text-primary">{{ example }}</code>
            </td>
            <td class="py-0.5 opacity-75">
              {{ meaning }}
            </td>
          </tr>
        </table>
        <p class="mt-2 opacity-75">
          In all sets, the names start with the set id: <code class="text-primary">^mdi:</code> searches one set.
        </p>
      </div>
    </div>
    <slot name="actions" />
  </div>
</template>
