<script setup lang='ts'>
import { inProgress, progressMessage } from '../store'
</script>

<template>
  <div
    border="~ base"
    class="fixed bottom-0 left-0 bg-base color-base rounded-tr shadow px-3 py-1 text-sm flex"
    :style="inProgress ? {} : { transform: 'translateY(120%)' }"
  >
    <Icon icon="carbon:circle-dash" class="rotating m-auto mr-1 text-lg" />
    <span class="m-auto px-1 blinking">{{ progressMessage }}</span>
  </div>
</template>

<style>
@keyframes rotating {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes blinking {
  from {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  to {
    opacity: 1;
  }
}

.rotating {
  animation: rotating 2s linear infinite;
}

.blinking {
  animation: blinking 2s linear infinite;
}
</style>
