<template>
  <div class="p-4">
    <h1 class="text-2xl font-light px-1">
      &lt;<Icon icon="mdi:emoticon-happy-outline" class="inline-block"/>>
      <b class="font-bold">Iconify</b>Explorer
    </h1>
    <p class="text-gray-600 px-1">
      by
      <a
        class="opacity-75 hover:opacity-100"
        href="https://github.com/antfu"
        target="_blank"
      >@antfu</a>
    </p>
    <div class="grid py-4 gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <router-link
        v-for="collection in collections"
        :key="collection.id"
        :to="`/collection/${collection.id}`"
      >
        <div class="rounded shadow transition-shadow duration-300 hover:shadow-lg flex">
          <Icons
            :icons="collection.icons.slice(0,9)"
            style="width:140px;height:140px;"
            class="border-r border-gray-300 pt-1 justify-center overflow-hidden"
          />
          <div class="px-4 py-2 bg-gray-100 flex-auto bg-opacity-50">
            <div class="text-gray-900 text-lg">{{collection.name}}</div>
            <div class="text-gray-500 text-sm block leading-none">{{collection.author}}</div>
            <div class="text-gray-500 text-xs block mt-2">{{collection.license}}</div>
            <div class="text-gray-500 text-xs block">{{collection.icons.length}} icons</div>
          </div>
        </div>
      </router-link>
    </div>
  </div>
</template>


<script lang='ts'>
import { defineComponent } from 'vue'
import { collections } from '../data'
import Icon from '../components/Icon.vue'
import Icons from '../components/Icons.vue'

export default defineComponent({
  components: {
    Icon,
    Icons
  },
  data() {
    return {
      collections
    }
  }
})
</script>
