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
})

const emit = defineEmits(['update:search', 'onKeydown'])

const input = ref<HTMLInputElement>()
defineExpose({ input })

function onKeydown(event: any) {
  emit('onKeydown', event)
}

function update(event: any) {
  emit('update:search', event.target.value)
}

function clear() {
  emit('update:search', '')
}
</script>

<template>
  <div :class="style ? ['md:flex md:shadow md:rounded outline-none md:py-1 py-3 px-4', { 'border-b border-x border-b md:border-t border-base': border }] : ''">
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

    <button class="flex items-center opacity-60 hover:opacity-80">
      <Icon v-if="search" icon="carbon:close" class="m-auto text-lg -mr-1" @click="clear" />
    </button>
    <slot name="actions" />
  </div>
</template>
