<template>
  <div class="p-5">
    <div>
      <IconButton icon="mdi:arrow-left" class="text-lg mb-3" @click="$router.replace('/')" />
      <div class="text-gray-900 text-lg">{{collection.name}}</div>
      <a
        class="text-gray-500 text-sm block leading-none hover:text-gray-900"
        :href="collection.url"
      >{{collection.author}}</a>
      <a
        class="text-gray-500 text-xs block mt-3 hover:text-gray-900"
        :href="collection.licenseURL"
        target="_blank"
      >{{collection.license}}</a>
      <div class="text-gray-500 text-xs block">{{collection.icons.length}} icons</div>
      <div class="flex mt-6">
        <input
          v-model="search"
          class="shadow rounded outline-none py-2 px-4 flex-auto"
          placeholder="Search..."
        />
        <!-- <div class="text-xl m-auto -ml-6 text-gray-400">
          <Icon icon="mdi:magnify" />
        </div>-->
      </div>
    </div>
    <div class="py-4">
      <Icons :icons="icons.slice(0, 200)" :selected="[selected]" @select="onSelect" />
    </div>
    <p class="text-gray-500 text-sm px-2">Icons: {{icons.length}}</p>

    <Modal :value="!!selected" @close="selected = null">
      <div class="flex" v-if="selected">
        <div class="text-6xl p-3 text-gray-700">
          <Icon :icon="selected" />
        </div>
        <div class="p-2">
          <p class="font-mono flex text-gray-700 font-light">
            {{selected}}
            <IconButton icon="mdi:content-copy" @click="copySelected" class="ml-2" />
          </p>
          <p class="text-gray-500">WIP... more info</p>
        </div>
      </div>
    </Modal>
  </div>
</template>

<script lang='ts'>
import { defineComponent, ref, computed } from 'vue'
import { collections } from '../data'
import Icon from '../components/Icon.vue'
import IconButton from '../components/IconButton.vue'
import Icons from '../components/Icons.vue'
import Modal from '../components/Modal.vue'

export default defineComponent({
  components: {
    Icon,
    IconButton,
    Icons,
    Modal
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const search = ref('')
    const selected = ref<string | null>(null)
    const collection = collections.find(c => c.id === props.id)!
    const icons = computed(() => {
      if (!search.value) {
        return collection.icons
      } else {
        return collection.icons.filter(i => i.indexOf(search.value) >= 0)
      }
    })

    const onSelect = (icon: string) => {
      console.log('hi', icon)
      selected.value = icon
    }

    const copySelected = () => {
      if (selected.value) navigator.clipboard.writeText(selected.value)
    }

    return {
      selected,
      search,
      collection,
      icons,
      onSelect,
      copySelected
    }
  }
})
</script>
