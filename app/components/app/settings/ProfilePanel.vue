<script setup lang="ts">
import { t } from '@psitta/vue'

const user = useUser()
</script>

<template>
  <div
    role="button"
    tabindex="0"
    class="cursor-pointer group bg-radial-[circle_at_bottom] from-magenta-50 to-gray-50 flex justify-between items-center transition duration-300 focus:outline-none p-6 w-full"
    @click="navigateTo('/app/settings/profile')"
  >
    <div class="flex gap-4 items-center">
      <Avatar
        :name="user?.name"
        wrapper-class="bg-white text-neutral-content"
        size="lg"
      />

      <label class="relative cursor-pointer flex flex-col gap-0">
        <h2 class="text-lg">{{ user?.name }}</h2>

        <small class="text-magenta-500">
          {{ t("Show profile") }}
        </small>
      </label>
    </div>

    <ChevronRight />
  </div>
</template>
