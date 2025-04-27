<script lang="ts" setup>
import { drawers } from '~/store'

const emit = defineEmits<{
  (e: 'close'): void
}>()

useAutoRedirect({
  query: { drawer: ['profile'] },
})

const { t } = useI18nExperimental()

const user = useUser()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar :title="t('Profile')" @close="emit('close')" />

    <div class="flex-1 overflow-y-auto bg-white">
      <ProfileHeader @edit="drawers.account = true" />

      <div class="p-4 flex-1 space-y-4">
        <SettingSection class="space-y-4">
          <TitleContentItem :label="t('Name')" role="button" @click="drawers.account = true">
            <template #icon>
              <Icon class="text-gray-800">
                material-symbols:person-outline
              </Icon>
            </template>

            <template #main>
              <div class="text-base text-gray-900">
                {{ user?.name }} {{ user?.lastName }}
              </div>
            </template>

            <template #footer>
              <span class="text-xs text-gray-500">
                {{ t('This name will be passed to the characters.') }}
              </span>
            </template>
          </TitleContentItem>

          <TitleContentItem :label="t('Username')" role="button" @click="drawers.account = true">
            <template #icon>
              <Icon class="text-gray-800">
                material-symbols:id-card-outline
              </Icon>
            </template>

            <template #main>
              <div class="text-base text-gray-900 mb-2">
                @{{ user?.username }}
              </div>
            </template>
          </TitleContentItem>
        </SettingSection>
      </div>
    </div>
  </div>
</template>
