<script setup lang="ts">
import { drawers, isRootDrawerOpen } from '~/store'
import type { MenuItemType } from '~/components/ui/navigation/types'

const logout = useLogout()

const t = (x: string) => x

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}

async function openProfile() {
  isRootDrawerOpen.value = true
  drawers.profile = true
}

async function openMyCharacters() {
  isRootDrawerOpen.value = true
  drawers.myCharacters = true
}

async function openSettings() {
  isRootDrawerOpen.value = true
  drawers.settings = true
}

const items: MenuItemType[] = [
  { id: 'profile', name: t('Profile'), icon: 'material-symbols:face', onClick: () => openProfile() },
  { id: 'discover-characters', name: t('Discover characters'), icon: 'material-symbols:person-search-outline-rounded', onClick: () => goToDiscover() },
  { id: 'my-characters', name: t('My characters'), icon: 'material-symbols:manage-accounts-outline-rounded', onClick: () => openMyCharacters() },
  {
    id: 'plan',
    name: t('Subscription'),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'material-symbols:subscriptions-outline-rounded',
    type: 'external',
  },
  { id: 'settings', name: t('Settings'), icon: 'material-symbols:settings-outline-rounded', onClick: () => openSettings() },
  {
    id: 'logout',
    name: t('Logout'),
    action: '/api/auth/logout',
    method: 'post',
    icon: 'material-symbols:logout',
    meaning: 'warning',
    onSubmit: logout,
  },
]
</script>

<template>
  <div class="dropdown dropdown-end">
    <Button class="btn btn-ghost btn-circle">
      <Icon name="material-symbols:more-vert" />
    </Button>

    <Menu :items="items" item-class="py-2" />
  </div>
</template>
