<script setup lang="ts">
import Icon from '#lib/daisy/components/display/Icon.vue'
import { t } from '#lib/i18n'
import { computed } from 'vue'
import { HOBBIES } from '../../constants'
import useProfile from '../../store'
import { parseJoin } from '../../utils'

const profile = useProfile()
const hobbies = computed(() => {
  return parseJoin(profile.value.hobbies || '', HOBBIES)
})
</script>

<template>
  <section class="pt-4">
    <label class="cursor-pointer">
      <h2 class="text-2xl mb-4 font-bold flex items-center gap-2">
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
        <div>
          <span class="font-bold">My profession</span>:
          <span>{{ profile.profession }}</span>
        </div>
      </div>
    </label>
  </section>
</template>
