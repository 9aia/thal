<script setup lang="ts">
import { t } from "@psitta/vue"
import type { User } from "lucia"
import { ITEMS } from "~/constants/base"

const user = inject<Ref<User>>("profile")!
</script>

<template>
  <section>
    <label>
      <h2 class="text-4xl text-slate-800 mb-4 font-bold flex items-center gap-2">
        {{ t("About me") }}
      </h2>

      <div class="space-y-2">
        <div
          v-for="item in ITEMS"
          v-show="user![item.id]"
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
