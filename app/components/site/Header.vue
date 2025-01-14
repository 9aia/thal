<template>
  <header class="sticky top-0 w-full z-[1000] bg-white text-cyan-500">
    <nav class="px-4 navbar max-w-[800px] mx-auto">
      <div class="navbar-start">
        <A href="/" class="text-xl flex gap-1 items-center justify-center">
          <span class="font-medium text-gray-800">Thal</span>

          <div class="custom-badge-container">
            <div class="custom-badge-content text-green-500 text-xs uppercase">
              <span class="px-2 py-1">
                Experimental
              </span>
            </div>
          </div>
        </A>
      </div>
      <div class="navbar-end">
        <slot name="navbar-end" />
      </div>
    </nav>
  </header>
</template>

<style>
.custom-badge-content {
  @apply border-transparent border-double border-2 rounded-3xl;
  background-image: linear-gradient(white, white), radial-gradient(circle at top left, theme('colors.green.500'), theme('colors.cyan.500'));
  background-origin: border-box;
  background-clip: content-box, border-box;
}
</style>
