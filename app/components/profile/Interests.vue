<script setup lang="ts">
import { t } from "@psitta/vue"
import type { User } from "lucia"
import { HOBBIES } from "~/constants/base"

const user = inject<Ref<User>>("profile")!
const hobbies = computed(() => {
  return parseJoin(user!.value.hobbies || "", HOBBIES)
})
</script>

<template>
  <section class="pt-4">
    <label>
      <h2 class="text-2xl text-slate-800 mb-4 font-bold flex items-center gap-2">
        {{ t("Interests") }}
      </h2>

      <div class="flex flex-wrap gap-2 mb-4">
        <div v-for="hobby in hobbies" :key="hobby.id" class="badge p-4 gap-2">
          <Icon>{{ hobby.icon }}</Icon>
          {{ t(hobby.name) }}
        </div>

        <div v-if="!hobbies?.length">
          {{ t("No hobby added.") }}
        </div>
      </div>

      <div class="flex items-center gap-2">
        <Icon>work</Icon>
        <div v-if="user!.profession">
          <span class="font-bold">My profession</span>:
          <span>{{ user!.profession }}</span>
        </div>
        <div v-else>
          {{ t("No profession added.") }}
        </div>
      </div>
    </label>
  </section>
</template>
