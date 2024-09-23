<script setup lang="ts">
import type { PropType } from 'vue'
import type { CollectionMeta } from '../data'
import { ref } from 'vue'
import { selectedPackageManager } from '../store'

const props = defineProps({
  collection: {
    type: Object as PropType<CollectionMeta>,
    required: true,
  },
})

const managers = ['pnpm', 'npm', 'yarn', 'bun'] as const

const icons = {
  npm: 'i-logos:npm-icon',
  pnpm: 'i-logos:pnpm',
  yarn: 'i-logos:yarn',
  bun: 'i-logos:bun',
}

function selectManager(packageName: string) {
  selectedPackageManager.value = packageName
}

const status = ref(false)

async function copyText() {
  const text = `${selectedPackageManager.value} ${selectedPackageManager.value !== 'npm' ? 'add' : 'i'} -D @iconify-json/${props.collection.id}`
  status.value = true
  setTimeout(() => {
    status.value = false
  }, 2000)

  if (text) {
    try {
      await navigator.clipboard.writeText(text)
      return true
    }
    catch {}
  }
  return false
}
</script>

<template>
  <div lt-md:hidden>
    <a
      href="https://iconify.design/docs/icons/json.html" target="_blank"
      class="block w-fit my-1 text-sm mt6 op50 hover:op100 hover:text-primary"
    >
      Install Iconify Iconset
    </a>
    <div class="border-1 border-base rounded w-fit min-w-100 mt1">
      <div flex="~ gap-4 items-center" p3 border="b base">
        <label
          v-for="manager in managers" :key="manager"
          flex="~ items-center gap-2"
          :class="[manager === selectedPackageManager ? 'op100' : 'op25']"
          @change="selectManager(manager)"
        >
          <input type="radio" name="manager" :value="manager" hidden>
          <div :class="icons[manager]" />
          <div mt--1>{{ manager }}</div>
        </label>
      </div>

      <div flex="~ gap-2 items-center" p3>
        <code flex-auto>
          <span style="color:#80A665;">{{ selectedPackageManager }}</span>
          <span style="color:#DBD7CAEE;" />
          <span style="color:#B8A965;">{{ selectedPackageManager !== 'npm' ? ' add ' : ' i ' }} -D </span>
          <span style="color:#DBD7CAEE;" /><span style="color:#DBD7CAEE;" />
          <span style="color:#C98A7D;">@iconify-json/{{ props.collection.id }}</span>
        </code>
        <IconButton icon="carbon:copy" @click="copyText" />
      </div>
      <Notification :value="status">
        <Icon icon="mdi:check" class="inline-block mr-2 font-xl align-middle" />
        <span class="align-middle">Copied</span>
      </Notification>
    </div>
  </div>
</template>
