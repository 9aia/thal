<script setup lang="ts">
import type { MenuItemType } from '~/components/ui/navigation/types'

const user = useUser()
const logout = useLogout()
const { t } = useI18nExperimental()

const localeModal = useLocaleModal()
const toast = useToast()

const menuItems = computed<MenuItemType[]>(() => {
  return [
    { id: 'app', name: t('Access app'), icon: 'material-symbols:chat-outline-rounded', href: '/app' },
    { id: 'settings', name: t('Manage account'), icon: 'material-symbols:settings-outline-rounded', href: '/settings/account' },
    {
      id: 'language',
      name: t('Language'),
      icon: 'material-symbols:language',
      onClick: () => localeModal.open(),
    },
    {
      id: 'logout',
      name: t('Logout'),
      action: '/api/auth/logout',
      method: 'post',
      icon: 'material-symbols:logout-rounded',
      meaning: 'warning',
      onSubmit: logout,
    },
  ]
})

const redirectUrl = useRedirectUrl()
</script>

<template>
  <div>
    <Header>
      <template #navbar-end>
        <div class="flex items-center gap-2 text-gray-900">
          <div>
            <div v-if="!!user">
              <Dropdown class="dropdown-end">
                <Avatar
                  type="button"
                  size="sm"
                  wrapper-class="bg-neutral text-neutral-content"
                />

                <DropdownContent :items="menuItems" />
              </Dropdown>
            </div>

            <A v-else class="flex text-left gap-1 text-black hover:text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit text-sm" href="/sign-in" @click="redirectUrl = '/app'">
              {{ t("Sign in") }}
            </A>
          </div>
        </div>
      </template>
    </Header>

    <main class="bg-white flex flex-col" style="min-height: calc(100vh - 64px)">
      <slot />
    </main>

    <Footer />

    <LazyCommonToast v-if="toast.visible.value" />
  </div>
</template>
