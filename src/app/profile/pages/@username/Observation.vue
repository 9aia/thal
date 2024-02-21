<script setup lang="ts">
import useProfile from '../../store'
import { t } from '#lib/i18n'

const profile = useProfile()
</script>

<template>
  <section class="pt-4">
    <label class="cursor-pointer">
      <h2 class="text-2xl mb-4 font-bold flex items-center gap-2">
        {{ t("Observation") }}
      </h2>

      <div class="flex flex-wrap gap-2 mb-4">
        <div v-if="profile.observation" class="w-full">
          <textarea
            readonly
            class="textarea text-md leading-[1.6em] h-40 w-full resize-none"
            :value="profile.observation"
          />
        </div>

        <div v-if="!profile.observation?.trim()">
          {{ t("No observation added.") }}
        </div>
      </div>
    </label>
  </section>
</template>
