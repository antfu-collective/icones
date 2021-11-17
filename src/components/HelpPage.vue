<template>
  <div class="p-6 w-120 help-page">
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
      Components
    </h2>
    <p>
      Created by the author of <b>Icônes</b>, <a href="https://github.com/antfu/unplugin-icons" target="_blank"><code>unplugin-icons</code></a> is a band new
      solution to use generate icons on-demand as components.
    </p>
    <p class="mt-2">
      Check out <a href="https://antfu.me/posts/journey-with-icons-continues" target="_blank">this blog post</a> for the story behind.
    </p>

    <h2 class="bold text-lg mt-5 mb-1">
      Pure CSS
    </h2>
    <p>
      With the power of <a href="https://github.com/antfu/unocss">UnoCSS</a>, you can also use the icons with <b>Pure CSS</b> using <a href="https://github.com/antfu/unocss/tree/main/packages/preset-icons" target="_blank"><code>@unocss/preset-icons</code></a>.
    </p>
    <p class="mt-2">
      Check out <a href="https://antfu.me/posts/icons-in-pure-css" target="_blank">this blog post</a> for more.
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
