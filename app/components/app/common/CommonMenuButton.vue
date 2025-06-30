<script setup lang="ts">
import { t } from '@psitta/vue'
import { isChatListDrawerOpen } from '~/store'
import type { MenuItemType, MenuItemTypeOrFalse } from '~/components/ui/navigation/types'

const props = defineProps<{
  hideDiscover?: boolean
}>()

const logout = useLogout()

async function goToDiscover() {
  isChatListDrawerOpen.value = false
  await navigateTo('/app/discover')
}

const items = computed(() => ([
  { id: 'profile', name: t('Profile'), icon: 'material-symbols:face', onClick: () => navigateTo('/app/settings/profile') },
  {
    id: 'plan',
    name: t('Subscription'),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'material-symbols:subscriptions-outline-rounded',
    type: 'external',
  },
  !props.hideDiscover && { id: 'discover-characters', name: t('Discover characters'), icon: 'material-symbols:person-search-outline-rounded', onClick: () => goToDiscover() },
  { id: 'my-characters', name: t('My characters'), icon: 'material-symbols:manage-accounts-outline-rounded', onClick: () => navigateTo('/app/settings/my-characters') },
  {
    id: 'submit-problem-or-suggestion',
    icon: 'material-symbols:feedback-outline-rounded',
    name: t('Submit a problem or suggestion'),
    type: 'external',
    href: 'https://forms.gle/ANMv7qnwTHva1k7L8',
    newTab: true,
    localize: false,
  },
  { id: 'settings', name: t('Settings'), icon: 'material-symbols:settings-outline-rounded', onClick: () => navigateTo('/app/settings') },
  {
    id: 'logout',
    name: t('Logout'),
    action: '/api/auth/logout',
    method: 'post',
    icon: 'material-symbols:logout-rounded',
    meaning: 'warning',
    onSubmit: logout,
  },
] satisfies MenuItemTypeOrFalse[]).filter(item => Boolean(item)) as MenuItemType[])
</script>

<template>
  <Dropdown class="dropdown-end">
    <Button
      class="btn btn-neutral btn-ghost btn-circle"

      icon="material-symbols:more-vert"
    />

    <DropdownContent :items="items" />
  </Dropdown>
</template>
