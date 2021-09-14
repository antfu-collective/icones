<template>
  <div class="p-6 w-110 help-page">
    <p class="mb-2 opacity-75">
      How to use the icon?
    </p>

    <h2 class="bold text-lg mb-1">
      Iconify Runtime
    </h2>
    <p>
      Iconify provides a runtime solution that fetchs icons on the go.
      Refer its <a href="https://iconify.design/" target="_blank">documentation</a> for more details.
    </p>

    <h2 class="bold text-lg mt-5 mb-1">
      Build tools
    </h2>
    <p>
      Created by the author of <b>Icônes</b>, <a href="https://github.com/antfu/unplugin-icons" target="_blank"><code>unplugin-icons</code></a> is a band new
      solution to use generate icons on-demand as components.
    </p>
    <p class="mt-2">
      It works prefectly for any frameworks and any build tools, while providing the excellent DX without sarifising the UX on the user-side.
    </p>
    <p class="mt-2">
      Check out <a href="https://antfu.me/posts/journey-with-icons-continues" target="_blank">this blog post</a> for more the story behind.
    </p>
  </div>
</template>

<style scoped lang="postcss">
.help-page {
  p {
    @apply text-black/60 dark:text-white/60;
  }
  a {
    @apply text-primary opacity-75 hover:opacity-100;
  }
}
</style>
