<script setup>
import { t } from '@psitta/vue'
</script>

<template>
  <div>
    <slot name="navbar-top" />
  </div>

  <header class="sticky top-0 w-full z-[1000] bg-white">
    <nav class="px-4 navbar max-w-[800px] mx-auto">
      <div class="navbar-start flex items-center gap-2">
        <A href="/" class="text-xl flex gap-2 items-center justify-center border border-transparent focus:border-b-2 focus:border-b-primary focus:outline-hidden">
          <img src="/favicon.ico" alt="Thal" class="w-6 h-6 grayscale">
          <span class="font-medium text-gray-800">Thal</span>
        </A>

        <div class="rounded-full bg-radial-[at_bottom] from-magenta-50 to-gray-50 text-black text-xs uppercase">
          <div class="px-2 py-1 block">
            {{ t('Experimental') }}
          </div>
        </div>
      </div>
      <div class="navbar-end">
        <slot name="navbar-end" />
      </div>
    </nav>
  </header>
</template>
