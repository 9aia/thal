<script setup lang="ts">
import { chatItemSearch, drawers, isRootDrawerOpen } from '~/store'
import type { MenuItem } from '~~/layers/ui/components/navigation/types'

const logout = useLogout()

function goToDiscover() {
  isRootDrawerOpen.value = false
  navigateTo('/app/discover')
}

const items: MenuItem[] = [
  { id: 'profile', name: 'Profile', icon: 'face', onClick: () => drawers.profile = true },
  { id: 'discover-personas', name: 'Discover characters', icon: 'person_search', onClick: () => goToDiscover() },
  { id: 'my-characters', name: 'My characters', icon: 'manage_accounts', onClick: () => drawers.myPersonas = true },
  {
    id: 'plan',
    name: 'Subscription',
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'subscriptions',
    type: 'external',
  },
  { id: 'settings', name: 'Settings', icon: 'settings', onClick: () => drawers.settings = true },
  {
    id: 'logout',
    name: 'Logout',
    action: '/api/auth/logout',
    method: 'post',
    icon: 'logout',
    onSubmit: logout,
  },
]
</script>

<template>
  <div class="dropdown dropdown-end">
    <button class="btn btn-circle btn-ghost text-primary" @click="updateRedirectUrl">
      <Icon>more_vert</Icon>
    </button>

    <Menu :items="items" />
  </div>
</template>
