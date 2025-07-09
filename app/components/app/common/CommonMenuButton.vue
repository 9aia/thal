<script setup lang="ts">
import { t } from '@psitta/vue'
import type { MenuItemType, MenuItemTypeOrFalse } from '~/components/ui/navigation/types'
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import { buildCharacter } from '~/store'

const props = defineProps<{
  hideDiscover?: boolean
}>()

const logout = useLogout()
const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)

async function goToDiscover() {
  sidebar.open.value = false
  await navigateTo('/app/discover')
}

function createCharacter() {
  buildCharacter(null)
  sidebar.push('build-character')
}

const items = computed(() => ([
  { id: 'new-character', name: t('New character'), icon: 'material-symbols:frame-person-outline-rounded', onClick: () => createCharacter() },
  !props.hideDiscover && { id: 'discover-characters', name: t('Discover characters'), icon: 'material-symbols:person-search-outline-rounded', onClick: () => goToDiscover() },
  { id: 'my-characters', name: t('My characters'), icon: 'material-symbols:manage-accounts-outline-rounded', onClick: () => navigateTo('/app/settings/my-characters') },
  {
    id: 'feedback',
    icon: 'material-symbols:feedback-outline-rounded',
    name: t('Send feedback'),
    type: 'external',
    href: 'https://forms.gle/ANMv7qnwTHva1k7L8',
    newTab: true,
    localize: false,
  },
  {
    id: 'manage-subscription',
    name: t('Manage subscription'),
    description: t(''),
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    icon: 'material-symbols:subscriptions-outline-rounded',
    type: 'external',
  },
  { id: 'settings-help', name: t('Settings & Help'), icon: 'material-symbols:settings-outline-rounded', onClick: () => navigateTo('/app/settings') },
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
