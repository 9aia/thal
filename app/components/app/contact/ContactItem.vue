<script setup lang="ts">
import { useLocale } from "@psitta/vue"

defineProps<{
  name: string
  description: string
  avatar?: string
}>()

useLocale()
</script>

<template>
  <div role="button" class="px-3 py-1 hover:bg-slate-100 flex gap-2 rounded items-center">
    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
      <div class="w-10 rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        >
      </div>
    </div>

    <div class="flex-1 flex flex-col justify-center">
      <div class="flex flex-col justify-between">
        <a class="block text-base text-slate-800">{{ name }}</a>

        <div class="text-xs text-slate-600 line-clamp-2">
          {{ description }}
        </div>
      </div>
    </div>
  </div>
</template>
