<script lang="ts" setup>
definePageMeta({
  layout: 'settings',
})

useAutoRedirect()

const { t } = useI18nExperimental()
const user = useUser()
const router = useRouter()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar :title="t('Profile')" @close="router.back()" />

    <div class="flex-1 overflow-y-auto bg-white pt-4">
      <ProfileHeader @edit="navigateTo('/app/settings/account')" />

      <div class="flex-1 mt-4">
        <SettingSection
          body-class="px-6 flex flex-col gap-4 w-full"
        >
          <TitleContentItem
            :label="t('Name')"
            role="button"
            class="cursor-pointer"
            @click="navigateTo('/app/settings/account')"
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
            @click="navigateTo('/app/settings/account')"
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
