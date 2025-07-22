<script setup lang="ts">
import { ref } from 'vue'
import type { MenuItemType, MenuItemTypeOrFalse } from '~/components/ui/navigation/types'
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
const whatsNew = useWhatsNew()

const isLocaleModalOpen = ref(false)
const isReleaseModalOpen = ref(false)

const general = computed(() => {
  const t = (x: string) => x

  return ([
    {
      id: 'account',
      icon: 'material-symbols:person-outline-rounded',
      name: t('Manage account'),
      href: '/app/settings/account',
    },
    {
      id: 'plan',
      name: t('Manage subscription'),
      action: '/api/payment/stripe/create-portal-session',
      method: 'post',
      icon: 'material-symbols:subscriptions-outline-rounded',
      type: 'external',
    },
    {
      id: 'my-characters',
      icon: 'material-symbols:manage-accounts-outline-rounded',
      name: t('My characters'),
      href: '/app/settings/my-characters',
    },
    {
      id: 'whats-new',
      icon: 'material-symbols:campaign-outline-rounded',
      name: t('What\'s New'),
      indicator: whatsNew.hasUnreadContent.value ? 'warning' : undefined,
      onClick: () => isWhatsNewModalOpen.value = true,
      type: 'accordion',
    },
    {
      id: 'change-locale',
      name: t('Interface language'),
      icon: 'material-symbols:globe',
      type: 'accordion',
      onClick: () => isLocaleModalOpen.value = true,
    },
  ] satisfies MenuItemTypeOrFalse[]).filter(Boolean) as MenuItemType[]
})

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
    {
      id: 'contact',
      icon: 'material-symbols:contact-support-outline-rounded',
      name: t('Contact Us'),
      href: '/contact',
      type: 'external',
      newTab: true,
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

const legal = computed(() => {
  const t = (x: string) => x

  return ([
    // TODO: add Guidelines and Reports
    // { id: 'guidelines', icon: 'gavel', name: t('Guidelines')/* , href: '/guidelines' */ },
    // { id: 'reports', icon: 'flag', name: t('Reports')/* , href: '/reports' */ },

    { id: 'terms', icon: 'material-symbols:gavel-rounded', name: t('Terms of Service'), href: '/legal/terms', type: 'external', newTab: true },
    { id: 'privacy', icon: 'material-symbols:policy-outline-rounded', name: t('Privacy Policy'), href: '/legal/privacy', type: 'external', newTab: true },
    { id: 'security', icon: 'material-symbols:security-rounded', name: t('Security Policy'), href: '/legal/security', type: 'external', newTab: true },
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
          <ItemList :items="general" />

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
          <ItemList :items="legal" />
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
