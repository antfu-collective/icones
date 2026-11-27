<script setup lang='ts'>
import { Scope } from '@sekiso/vue'
import { footer } from './sekiso/behavior/footer'

const buildDate = new Date(__BUILD_TIME__)
const time = useDateFormat(buildDate, 'YYYY/MM/DD HH:mm')
const ago = useTimeAgo(buildDate)
const footerOptions = computed(() => ({ time: time.value, ago: ago.value }))
</script>

<template>
  <!-- One footer instance, for every view that embeds `footerView` -->
  <Scope :of="footer" :options="footerOptions">
    <!-- On mobile the document scrolls, so iOS scrolls to the top on a status bar tap -->
    <div class="flex flex-col min-h-screen md:h-screen md:overflow-hidden bg-base">
      <div class="flex-auto md:h-full md:overflow-overlay">
        <RouterView />
      </div>
      <Progress />
    </div>
  </Scope>
</template>
