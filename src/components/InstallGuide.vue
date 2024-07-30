<script setup lang="ts">
import type { CollectionMeta } from '../data'

const props = defineProps({
  collection: {
    type: Object as PropType<CollectionMeta>,
    required: true,
  },
})

const packages = ref(['npm', 'pnpm', 'yarn'])
let currentPkn = $ref('npm')

function changePgn(packageName: string) {
  currentPkn = packageName
}

let status = $ref(false)
async function copyText() {
  const text = `${currentPkn} ${currentPkn !== 'npm' ? 'add' : 'i'} @iconify-json/${props.collection.id}`
  status = true
  setTimeout(() => {
    status = false
  }, 2000)
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
</script>

<template>
  <div class="w-a xl:w-30% border-1 border-base p-2 my-1 rounded">
    <div class="border-b border-base flex items-center p1 pl-0">
      <label v-for="pkn in packages" :key="pkn" class="cursor-pointer mx-2 ml-0 opacity25" :class="{ opacity120: pkn === currentPkn }" @change="changePgn(pkn)">
        <input type="radio" name="pkn" :value="pkn" hidden>
        {{ pkn }}
      </label>
    </div>

    <div class="relative py-1">
      <code v-for="pkn in packages" :key="pkn">
        <span v-show="currentPkn === pkn">
          <span style="color:#80A665;">{{ pkn }}</span><span style="color:#DBD7CAEE;" /><span style="color:#C98A7D;">{{ pkn !== 'npm' ? ' add ' : ' i ' }}</span><span style="color:#DBD7CAEE;" /><span style="color:#DBD7CAEE;" /><span style="color:#C98A7D;">@iconify-json/{{ props.collection.id }}</span><span style="color:#DBD7CAEE;" />
        </span>
      </code>
      <IconButton icon="carbon:copy" class="ml-2 absolute top-0 right-0" @click="copyText" />
    </div>
    <Notification :value="status">
      <Icon icon="mdi:check" class="inline-block mr-2 font-xl align-middle" />
      <span class="align-middle">Copied</span>
    </Notification>
  </div>
</template>
