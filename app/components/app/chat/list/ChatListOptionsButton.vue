<script setup lang="ts">
import { drawers, isRootDrawerOpen } from '~/store'
import type { MenuItemType } from '~/components/ui/navigation/types'

const props = defineProps<{
  hideHome?: boolean
}>()

const logout = useLogout()

const t = (x: string) => x

async function goToHome() {
  await navigateTo('/app/')
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

const items = computed(() => [
  !props.hideHome && { id: 'home', name: t('Home'), icon: 'material-symbols:home-outline-rounded', onClick: () => goToHome() },
  { id: 'profile', name: t('Profile'), icon: 'material-symbols:face', onClick: () => openProfile() },
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
    icon: 'material-symbols:logout-rounded',
    meaning: 'warning',
    onSubmit: logout,
  },
].filter(item => Boolean(item)))
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
