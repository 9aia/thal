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
    <Navbar>
      <h1 class="text-lg py-2 text-gradient-1 flex items-center gap-1">
        <Button size="sm" class="btn-ghost" shape="circle" @click="emit('close')">
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
              <Icon class="text-gray-800">
                person
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
                id_card
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

<style scoped>
.text-gradient-1 {
  background: radial-gradient(theme('colors.blue.500'), theme('colors.cyan.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
