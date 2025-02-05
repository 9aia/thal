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

const items: MenuItem[] = [
  { id: 'profile', name: t('Profile'), icon: 'face', onClick: () => drawers.profile = true },
  { id: 'discover-characters', name: t('Discover characters'), icon: 'person_search', onClick: () => goToDiscover() },
  { id: 'my-characters', name: t('My characters'), icon: 'manage_accounts', onClick: () => drawers.myPersonas = true },
  {
    id: 'plan',
    name: t('Subscription'),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'subscriptions',
    type: 'external',
  },
  { id: 'settings', name: t('Settings'), icon: 'settings', onClick: () => drawers.settings = true },
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
    <button class="btn btn-circle btn-ghost text-black" @click="updateRedirectUrl">
      <Icon>more_vert</Icon>
    </button>

    <Menu :items="items" item-class="py-2" />
  </div>
</template>
