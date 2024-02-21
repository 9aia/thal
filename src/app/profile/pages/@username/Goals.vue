<script setup lang="ts">
import Icon from '#lib/daisy/components/display/Icon.vue'
import { t } from '#lib/i18n'
import { computed } from 'vue'
import { GOALS } from '../../constants'
import useProfile from '../../store'
import { parseJoin } from '../../utils'

const profile = useProfile()
const goals = computed(() => {
  return parseJoin(profile.value.goals || '', GOALS)
})
</script>

<template>
  <section class="pt-4">
    <label class="cursor-pointer">
      <h2 class="text-2xl mb-4 font-bold flex items-center gap-2">
        {{ t("Goals") }}
      </h2>

      <div class="flex flex-wrap gap-2">
        <div v-for="goal in goals" :key="goal.id" class="badge p-4 gap-2">
          <Icon>{{ goal.icon }}</Icon>
          {{ t(goal.name) }}
        </div>

        <div v-if="!goals?.length">
          {{ t("No goals added.") }}
        </div>
      </div>
    </label>
  </section>
</template>
