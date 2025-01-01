<script setup lang="ts">
import { t } from '@psitta/vue'
import type { User } from '~~/db/schema'

const user = inject<Ref<User>>('profile')!
</script>

<template>
  <section class="pt-4">
    <label>
      <h2 class="text-sm text-primary py-2 font-bold">
        {{ t("Observation") }}
      </h2>

      <div class="flex flex-wrap gap-2 mb-4">
        <div v-if="user!.observation" class="w-full">
          <textarea
            readonly
            class="textarea text-md leading-[1.6em] h-40 w-full resize-none"
            :value="user!.observation"
          />
        </div>

        <div v-if="!user!.observation?.trim()">
          {{ t("No observation added.") }}
        </div>
      </div>
    </label>
  </section>
</template>
