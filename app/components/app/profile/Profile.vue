<script lang="ts" setup>
import { useI18n } from '@psitta/vue'
import { drawers } from '~/store'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()

const user = useUser()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        <Button size="sm" class="btn-ghost btn-circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Button>
        {{ t("Profile") }}
      </h1>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <ProfileHeader @edit="drawers.account = true" />

      <div class="p-4 flex-1 space-y-4">
        <SettingSection class="space-y-4">
          <TitleContentItem :label="t('Name')" role="button" @click="drawers.account = true">
            <template #icon>
              <Icon class="text-primary">
                person
              </Icon>
            </template>

            <template #main>
              <div class="text-base text-slate-900">
                {{ user?.name }} {{ user?.lastName }}
              </div>
            </template>

            <template #footer>
              <span class="text-xs text-slate-500">
                {{ t('This name will be passed to the characters.') }}
              </span>
            </template>
          </TitleContentItem>

          <TitleContentItem :label="t('Username')" role="button" @click="drawers.account = true">
            <template #icon>
              <Icon class="text-primary">
                id_card
              </Icon>
            </template>

            <template #main>
              <div class="text-base text-slate-900 mb-2">
                @{{ user?.username }}
              </div>
            </template>
          </TitleContentItem>
        </SettingSection>
      </div>
    </div>
  </div>
</template>
