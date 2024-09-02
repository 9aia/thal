<script setup lang="ts">
import { useLocale } from "@psitta/vue"

defineProps<{
  name: string
  avatar?: string
}>()

const emit = defineEmits<{
  (e: "edit"): void
  (e: "delete"): void
}>()

useLocale()
</script>

<template>
  <div role="button" class="px-3 py-1 hover:bg-slate-100 flex gap-2 rounded items-center group">
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
      </div>
    </div>

    <div class="hidden group-hover:flex">
      <button
        class="btn btn-ghost btn-circle text-slate-700"
        @click="emit('edit')"
      >
        <Icon name="edit" class="text-slate-700 text-primary" />
      </button>

      <button
        class="btn btn-ghost btn-circle text-slate-700"
        @click="emit('delete')"
      >
        <Icon name="delete" class="text-slate-700 text-xs" />
      </button>
    </div>
  </div>
</template>
