<script lang="ts" setup>
import { useI18n } from "@psitta/vue"
import { drawers } from "~/store"

const emit = defineEmits<{
  (e: "close"): void
}>()

const { t } = useI18n()

const user = useUser()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        <Btn size="sm" class="btn-ghost btn-circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Btn>
        {{ t("Profile") }}
      </h1>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <div class="bg-slate-200 p-4">
        <Header @edit="drawers.account = true" />
      </div>

      <div class="p-4 flex-1 space-y-4">
        <SettingSection :title="t('Your name')">
          {{ user!.name }}
        </SettingSection>

        <SettingSection :title="t('About')">
          {{ user!.observation }}
        </SettingSection>
      </div>
    </div>
  </div>
</template>
