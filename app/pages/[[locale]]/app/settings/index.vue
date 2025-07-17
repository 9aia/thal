<script setup lang="ts">
import { ref } from 'vue'
import type { MenuItemType, MenuItemTypeOrFalse } from '~/components/ui/navigation/types'
import { SETTINGS } from '~/constants/settings'
import { isWhatsNewModalOpen } from '~/store'
// import { dummyT as t } from '@psitta/vue'

definePageMeta({
  layout: 'settings',
  middleware: 'premium',
  pageTransitionType: 'slide',
})

useAutoRedirect()

const { t } = useI18nExperimental()
const router = useRouter()
const logout = useLogout()
const releaseType = useReleaseType()

const isLocaleModalOpen = ref(false)
const isReleaseModalOpen = ref(false)

const support = computed(() => {
  const t = (x: string) => x

  return ([
    (releaseType.value === 'dev' || releaseType.value === 'stable') && {
      id: 'about-thal',
      icon: 'material-symbols:info-outline-rounded',
      name: t('About Thal'),
      onClick: () => isReleaseModalOpen.value = true,
      type: 'accordion',
    },
    releaseType.value === 'preview' && {
      id: 'about-preview',
      icon: 'material-symbols:info-outline-rounded',
      name: t('About preview'),
      onClick: () => isReleaseModalOpen.value = true,
      type: 'accordion',
    },
    releaseType.value === 'early-access' && {
      id: 'about-early-access',
      icon: 'material-symbols:info-outline-rounded',
      name: t('About early access'),
      onClick: () => isReleaseModalOpen.value = true,
      type: 'accordion',
    },
    releaseType.value === 'early-stable' && {
      id: 'about-early-stable',
      icon: 'material-symbols:info-outline-rounded',
      name: t('About early stable'),
      onClick: () => isReleaseModalOpen.value = true,
      type: 'accordion',
    },
    {
      id: 'whats-new',
      icon: 'material-symbols:campaign-outline-rounded',
      name: t('What\'s New'),
      onClick: () => isWhatsNewModalOpen.value = true,
      type: 'accordion',
    },
    {
      id: 'rate-thal',
      icon: 'material-symbols:star-outline-rounded',
      name: t('Rate Thal'),
      type: 'external',
      href: 'https://forms.gle/yHaiExzsQvv1mTdM8',
      newTab: true,
      localize: false,
    },
    {
      id: 'submit-problem-or-suggestion',
      icon: 'material-symbols:feedback-outline-rounded',
      name: t('Send feedback'),
      description: t('Report a problem or send us suggestions'),
      type: 'external',
      href: 'https://forms.gle/UyGBzPrBeNfFgwLD6',
      newTab: true,
      localize: false,
    },
    // TODO: add About Thal and Help Center
    // {
    //   id: 'about-thal',
    //   icon: 'info',
    //   name: 'About Thal',
    //   // onClick: () => openAboutThalModal(),
    //   type: 'accordion',
    // },
    // {
    //   id: 'help-center',
    //   icon: 'help_center',
    //   name: 'Help Center',
    //   href: '/help',
    //   type: 'external',
    // },
  ] satisfies MenuItemTypeOrFalse[]).filter(Boolean) as MenuItemType[]
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between w-full absolute">
    <Navbar
      :title="t('Settings')"
      @back="router.back()"
    />

    <div class="h-2 bg-white" />

    <div class="flex-1 overflow-y-auto bg-white">
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
              name: t('Interface language'),
              icon: 'material-symbols:globe',
              type: 'accordion',
              onClick: () => isLocaleModalOpen = true,
            }]"
          />

          <LazyLocaleModal v-model="isLocaleModalOpen" />
        </SettingSection>

        <SettingSection
          :title="t('Support')"
          title-class="px-6"
          body-class="px-4"
        >
          <ItemList :items="support" />
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

        <LazyReleaseModal v-model="isReleaseModalOpen" />
      </div>
    </div>
  </div>
</template>
