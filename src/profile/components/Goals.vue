<script setup lang="ts">
import Icon from '~/src/ui/components/display/Icon.vue'
import { t } from '~/lib/psitta/vue'
import { computed } from 'vue'
import { parseJoin } from '~/src/base/utils/string'
import { GOALS } from '~/src/base/constants';
import type { User } from 'lucia';

const user = inject<Ref<User>>('profile')!
const goals = computed(() => {
  return parseJoin(user.value!.goals || '', GOALS)
})
</script>

<template>
  <section class="pt-4">
    <label class="cursor-pointer">
      <h2 class="text-2xl text-slate-800 mb-4 font-bold flex items-center gap-2">
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
