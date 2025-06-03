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
      <ProfileHeader @edit="drawers.accountSettings = true" />

      <div class="p-4 flex-1">
        <SettingSection body-class="flex flex-col gap-4">
          <TitleContentItem
            :label="t('Name')"
            role="button"
            class="cursor-pointer"
            @click="drawers.accountSettings = true"
          >
            <template #icon>
              <Icon name="material-symbols:person-outline-rounded" />
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

          <TitleContentItem
            :label="t('Username')"
            role="button"
            class="cursor-pointer"
            @click="drawers.accountSettings = true"
          >
            <template #icon>
              <Icon name="material-symbols:id-card-outline-rounded" />
            </template>

            <template #main>
              <div class="text-black mb-2">
                @{{ user?.username }}
              </div>
            </template>
          </TitleContentItem>
        </SettingSection>
      </div>
    </div>
  </div>
</template>
