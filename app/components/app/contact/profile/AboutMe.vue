<script setup lang="ts">
import { t } from '@psitta/vue'
import type { User } from '~~/db/schema'
import { ITEMS } from '~/constants/base'

const user = inject<Ref<User>>('profile')!

const hasAtLeastOne = computed(() => ITEMS.some(item => !!user.value[item.id]))
</script>

<template>
  <section v-if="hasAtLeastOne">
    <label>
      <h2 class="text-sm text-primary py-2 font-bold">
        {{ t("About me") }}
      </h2>

      <div class="space-y-2">
        <div
          v-for="item in ITEMS"
          :key="item.id"
          class="flex items-center gap-2"
        >
          <Icon>{{ item.icon }}</Icon>
          <span>{{ item.label }} {{ user![item.id] }}</span>
        </div>
      </div>
    </label>
  </section>
</template>
