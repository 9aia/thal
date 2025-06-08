<script setup lang="ts">
import { t } from '@psitta/vue'

defineProps<{
  hasContact: boolean
  avatarName: string
  displayName: string
  description: string
}>()
</script>

<template>
  <div
    v-if="!hasContact"
    class="bg-radial-[at_top] from-yellow-50 to-gray-50 mb-8 text-gray-800 text-center sm:max-w-lg mx-auto rounded-3xl"
  >
    <div class="py-8 px-4">
      <Avatar :name="avatarName" class="mx-auto w-20 h-20 text-lg bg-gray-100 text-gray-800" />

      <h2 class="text-gray-900 text-center mb-1">
        {{ displayName }}
      </h2>

      <small class="text-gray-600 text-xs">~ {{ description }}</small>

      <p class="mb-2 text-gray-600 text-sm">
        {{ t('Not a contact') }}
      </p>

      <div class="card-actions justify-center">
        <Button class="btn btn-soft btn-primary" @click="addContact()">
          <Icon name="material-symbols:person-add-outline" />
          {{ t('Add') }}
        </Button>
      </div>
    </div>
  </div>
</template>
