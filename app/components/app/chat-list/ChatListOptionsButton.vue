<script setup lang="ts">
import { drawers, isRootDrawerOpen } from '~/store'
import type { MenuItem } from '~/components/ui/navigation/types'

const logout = useLogout()

const t = (x: string) => x
const { focusMainField: focusSearch } = useDiscoverFocus()

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')

  await nextTick()

  focusSearch()
}

async function openProfile() {
  isRootDrawerOpen.value = true
  drawers.profile = true
}

async function openMyCharacters() {
  isRootDrawerOpen.value = true
  drawers.myPersonas = true
}

async function openSettings() {
  isRootDrawerOpen.value = true
  drawers.settings = true
}

const items: MenuItem[] = [
  { id: 'profile', name: t('Profile'), icon: 'face', onClick: () => openProfile() },
  { id: 'discover-characters', name: t('Discover characters'), icon: 'person_search', onClick: () => goToDiscover() },
  { id: 'my-characters', name: t('My characters'), icon: 'manage_accounts', onClick: () => openMyCharacters() },
  {
    id: 'plan',
    name: t('Subscription'),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'subscriptions',
    type: 'external',
  },
  { id: 'settings', name: t('Settings'), icon: 'settings', onClick: () => openSettings() },
  {
    id: 'logout',
    name: t('Logout'),
    action: '/api/auth/logout',
    method: 'post',
    icon: 'logout',
    meaning: 'warning',
    onSubmit: logout,
  },
]
</script>

<template>
  <div class="dropdown dropdown-end">
    <button class="btn btn-circle btn-ghost text-black">
      <Icon>more_vert</Icon>
    </button>

    <Menu :items="items" item-class="py-2" />
  </div>
</template>
