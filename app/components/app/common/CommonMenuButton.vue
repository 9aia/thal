<script setup lang="ts">
import { isChatListDrawerOpen } from '~/store'
import type { MenuItemType, MenuItemTypeOrFalse } from '~/components/ui/navigation/types'
// import { dummyT as t } from '@psitta/vue'

const props = defineProps<{
  hideHome?: boolean
  hideDiscover?: boolean
}>()

const logout = useLogout()

const t = (x: string) => x

async function goToHome() {
  isChatListDrawerOpen.value = false
  await navigateTo('/app/')
}

async function goToDiscover() {
  isChatListDrawerOpen.value = false
  await navigateTo('/app/discover')
}

const items = computed(() => ([
  !props.hideHome && { id: 'home', name: t('Home'), icon: 'material-symbols:home-outline-rounded', onClick: () => goToHome() },
  { id: 'profile', name: t('Profile'), icon: 'material-symbols:face', onClick: () => navigateTo('/app/settings/profile') },
  !props.hideDiscover && { id: 'discover', name: t('Discover'), icon: 'material-symbols:person-search-outline-rounded', onClick: () => goToDiscover() },
  { id: 'my-characters', name: t('My characters'), icon: 'material-symbols:manage-accounts-outline-rounded', onClick: () => navigateTo('/app/settings/my-characters') },
  {
    id: 'plan',
    name: t('Subscription'),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'material-symbols:subscriptions-outline-rounded',
    type: 'external',
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
