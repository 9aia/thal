<script setup lang="ts">
import { t } from '@psitta/vue'
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { chatItemSearch, drawers, isRootDrawerOpen } from '~/store'

import type { MenuItem } from '~~/layers/ui/components/navigation/types'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = useForm({
  initialValues: {
    search: '',
  },
})

watchDebounced(toRef(form.values, 'search'), () => {
  chatItemSearch.value = form.values.search
})

const {
  data: chats,
} = await useServerQuery(() => '/api/chat', {
  queryKey: queryKeys.chatsSearch(chatItemSearch),
  params: () => {
    return {
      search: chatItemSearch.value,
    }
  },
})

const isNoteVisible = useCookie('isNoteVisible', {
  default: () => true,
})

const logout = useLogout()

function goToDiscover() {
  isRootDrawerOpen.value = false
  navigateTo('/app/discover')
}

const items: MenuItem[] = [
  { id: 'profile', name: 'Profile', icon: 'face', onClick: () => drawers.profile = true },
  { id: 'discover-personas', name: 'Discover Characters', icon: 'person_search', onClick: () => goToDiscover() },
  { id: 'my-characters', name: 'My Characters', icon: 'manage_accounts', onClick: () => drawers.myPersonas = true },
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
  <div class="bg-white h-full">
    <Navbar class="bg-slate-800">
      <A href="/app/" class="text-lg font-bold text-teal-500 flex items-center">
        Thal
      </A>

      <div class="dropdown dropdown-end">
        <button class="btn btn-circle btn-ghost text-primary" @click="updateRedirectUrl">
          <Icon>more_vert</Icon>
        </button>

        <Menu :items="items" />
      </div>
    </Navbar>

    <div v-show="isNoteVisible" class="bg-slate-200 px-3 py-4 flex items-center justify-between w-min-full">
      <div class="flex items-center gap-2">
        <div>
          <div class="p-2 flex items-center justify-center">
            <Icon name="waving_hand" class="text-primary" />
          </div>
        </div>

        <div class="flex flex-col">
          <h2 class="text-lg text-slate-800">
            Welcome!
          </h2>
          <p class="text-sm text-slate-800">
            Every conversation is a step closer to your goals.
          </p>
        </div>

        <div>
          <button class="btn btn-md btn-ghost btn-circle" @click="isNoteVisible = false">
            <Icon name="close" class="text-primary" />
          </button>
        </div>
      </div>
    </div>

    <div class="px-4 py-2">
      <SearchField
        :placeholder="t('Search by name or username')"
        path="search"
      />
    </div>

    <div class="flex-1 overflow-y-auto bg-white">
      <header v-if="!chats?.length && !chatItemSearch.trim()" class="w-full text-center pt-8">
        <div class="text-primary flex items-center justify-center">
          <Icon name="chat" style="font-size: 8rem" />
        </div>

        <h2 class="text-lg font-medium px-4 py-2">
          {{ t("New Chat") }}
        </h2>

        <p class="px-4 text-sm text-gray-700 mb-8">
          {{ t("Begin a conversation with a character or create a custom one tailored to your learning objectives.") }}
        </p>

        <Btn class="btn-primary pl-2" @click="drawers.newChat = true">
          <Icon name="add" />
          {{ t("New chat") }}
        </Btn>
      </header>

      <template v-else-if="!chats?.length">
        <p class="text-slate-500 text-sm py-2 px-6 text-center">
          {{ chatItemSearch ? t(`No results found for "{query}"`, { query: chatItemSearch }) : t('No results found.') }}
        </p>
      </template>

      <template v-else>
        <ChatItem
          v-for="chat in chats"
          :key="chat.chatId"
          :chat="chat"
          @click="emit('close')"
        />
      </template>
    </div>

    <div class="absolute bottom-4 right-4">
      <Btn size="md" class="btn-circle btn-primary" @click="drawers.newChat = true">
        <Icon name="add" />
      </Btn>
    </div>
  </div>
</template>
