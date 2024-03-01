<script setup lang="ts">
import Icon from '#lib/daisy/components/display/Icon.vue'
import { t } from '#lib/i18n'
import { ITEMS } from '../../constants'
import useProfile from '../../store'

const profile = useProfile()
</script>

<template>
  <section>
    <label class="cursor-pointer">
      <h2 class="text-4xl text-slate-800 mb-4 font-bold flex items-center gap-2">
        {{ t("About me") }}
      </h2>

      <div class="space-y-2">
        <div
          v-for="item in ITEMS"
          v-show="profile[item.id]"
          :key="item.id"
          class="flex items-center gap-2"
        >
          <Icon>{{ item.icon }}</Icon>
          <span>{{ item.label }} {{ profile[item.id] }}</span>
        </div>
      </div>
    </label>
  </section>
</template>
