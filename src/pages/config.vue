<script setup lang='ts'>
import { userConfig } from '../store'
</script>

<template>
  <WithNavbar>
    <div py-8 px-8 text-gray-700 dark:text-dark-700>
      <div text-gray-900 text-2xl mb-2 dark:text-gray-200>
        Config page
      </div>
      <div op50 text-sm mb-6>
        Edit your custom config below. Config will be auto saved in localStorage.
      </div>
      <div v-for="(_, configKey) in userConfig" :key="configKey" mb-6>
        <div op70 text-xl mb-4 dark:text-gray-200>
          {{ configKey }}
        </div>
        <div v-for="(__, subConfigKey) in userConfig[configKey]" :key="subConfigKey" flex items-center>
          <div mr-2 op70>
            {{ subConfigKey }}:
          </div>
          <input
            v-model="userConfig[configKey][subConfigKey]"
            text-base outline-none py-1 px-4 bg-transparent border rounded border-base
          >
          <Icon v-show="userConfig[configKey][subConfigKey]" icon="carbon:close" class="text-lg -ml-6 opacity-60" @click="userConfig[configKey][subConfigKey] = ''" />
        </div>
      </div>
    </div>
  </WithNavbar>
</template>
