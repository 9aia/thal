<script setup lang="ts">
import { t } from '@psitta/vue'
import { ref } from 'vue'
import { SETTINGS } from '~/constants/settings'

definePageMeta({
  layout: 'settings',
})

useAutoRedirect()

const logout = useLogout()
const router = useRouter()
const { isExternalEntry } = useSpaReferrer()

const isLocaleModalOpen = ref(false)

function handleClose() {
  if (isExternalEntry.value) {
    navigateTo('/app/')
    return
  }

  router.back()
}
</script>

<template>
  <div class="flex flex-col h-dvh justify-between w-full absolute">
    <Navbar :title="t('Settings')" @close="handleClose" />

    <div class="flex-1 overflow-y-auto bg-white mt-2">
      <ProfilePanel />

      <div class="space-y-4 py-6">
        <SettingSection
          :title="t('General')"
          title-class="px-6"
          body-class="px-4"
        >
          <ItemList
            :items="[...SETTINGS.general, {
              id: 'change-locale',
              name: t('Language'),
              icon: 'material-symbols:globe',
              type: 'accordion',
              onClick: () => isLocaleModalOpen = true,
            }]"
          />

          <LocaleModal v-model="isLocaleModalOpen" />
        </SettingSection>

        <SettingSection
          :title="t('Support')"
          title-class="px-6"
          body-class="px-4"
        >
          <ItemList :items="SETTINGS.support" />
        </SettingSection>

        <SettingSection
          :title="t('Legal')"
          title-class="px-6"
          body-class="px-4"
        >
          <ItemList :items="SETTINGS.legal" />
        </SettingSection>

        <SettingSection
          body-class="px-4"
        >
          <ItemList
            :items="[
              {
                id: 'logout',
                name: t('Logout'),
                icon: 'material-symbols:logout-rounded',
                meaning: 'warning',
                onClick: logout,
              },
            ]"
          />
        </SettingSection>
      </div>
    </div>
  </div>
</template>
