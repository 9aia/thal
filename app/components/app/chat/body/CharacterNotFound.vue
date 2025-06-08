<script setup lang="ts">
import { T, t } from '@psitta/vue'

defineProps<{
  username: string
}>()
</script>

<template>
  <div class="flex flex-col h-full justify-center items-center bg-white">
    <Icon
      name="material-symbols:person-cancel-outline-rounded"
      class="text-red-500 text-9xl"
    />

    <h1 class="text-2xl mb-2">
      {{ t('Character Not Found') }}
    </h1>

    <p class="text-sm text-gray-500">
      <T
        text="The character {username} does not exist."
        :values="{ username }"
        class="flex items-center justify-center gap-1"
      >
        <template #username>
          <span class="text-orange-500">
            @{{ username }}
          </span>
        </template>
      </T>
    </p>
  </div>
</template>
