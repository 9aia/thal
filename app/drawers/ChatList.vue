<script setup lang="ts">
import { t } from '@psitta/vue'
import { useQuery } from '@tanstack/vue-query'
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { chatItemSearch, drawers, isRootDrawerOpen } from '~/store'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const form = useForm({
  initialValues: {
    search: '',
  },
})

const user = useUser()

watchDebounced(toRef(form.values, 'search'), () => {
  chatItemSearch.value = form.values.search
}, { debounce: 500 })

const localWithDefaultRegion = useLocaleDefaultRegion()

const {
  data: chats,
  isPending,
  isError,
  refetch,
} = await useServerQuery('/api/chat', {
  queryKey: queryKeys.chatsSearch(localWithDefaultRegion.value, chatItemSearch),
  params: () => {
    return {
      search: chatItemSearch.value,
      locale: localWithDefaultRegion.value,
    }
  },
})

const isNoteVisibleCookie = useCookie('isNoteVisible', {
  default: () => true,
})
const isNoteVisible = ref(isNoteVisibleCookie.value)

const lastSavedContentCount = useCookie('lastSavedContentCount', {
  default: () => 0,
})

const countQuery = useQuery({
  queryKey: ['content-count'],
  queryFn: async () => {
    const contentCount = await queryContent().count()
    return contentCount
  },
})

const hasUnreadContent = computed(() => {
  if (!countQuery.data.value) {
    return false
  }

  return countQuery.data.value > lastSavedContentCount.value
})

const { open: openWhatsNewModalFn } = useWhatsNewModal()

async function openWhatsNewModal() {
  openWhatsNewModalFn()

  const contentAmount = await queryContent().count()

  if (hasUnreadContent.value) {
    lastSavedContentCount.value = contentAmount
  }
}

async function goToDiscover() {
  isRootDrawerOpen.value = false
  await navigateTo('/app/discover')
}

const isPastDueVisible = computed(() => {
  if (!user.value) {
    return false
  }

  return isPlanPastDue(user.value)
})

onMounted(() => {
  isNoteVisibleCookie.value = false
})
</script>

<template>
  <div class="bg-white flex flex-col h-dvh justify-between">
    <Navbar hide-title hide-back>
      <h1 class="text-lg py-2 text-gradient-1 flex items-center gap-1">
        <A href="/app/" class="text-lg text-black flex items-center">
          {{ t("Thal") }}
        </A>
      </h1>

      <div class="flex items-center">
        <Button
          class="btn-ghost"
          shape="circle"
          no-disable-on-loading
          :class="{
            'text-orange-500': hasUnreadContent,
            'text-black': !hasUnreadContent,
          }"
          :loading="countQuery.isLoading.value"
          @click="openWhatsNewModal"
        >
          <Icon v-show="!countQuery.isLoading.value" name="material-symbols:campaign-outline" />
        </Button>

        <Button
          class="btn-ghost"
          shape="circle"
          no-disable-on-loading
          @click="goToDiscover"
        >
          <span class="px-4 py-1 flex items-center justify-center gap-1">
            <Icon name="material-symbols:person-search-outline" />
          </span>
        </Button>

        <ChatListOptionsButton />
      </div>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <AppNote
        v-model="isNoteVisible"
        icon-name="material-symbols:waving-hand-outline"
      >
        <h2 class="text-lg text-gradient-2 w-fit">
          {{ t('Welcome!') }}
        </h2>
      </AppNote>

      <AppNote
        :model-value="isPastDueVisible"
        hide-close
      >
        <div class="flex justify-between items-center gap-2 w-full">
          <h2 class="text-sm text-black">
            <div>{{ t("Renew your overdue subscription to keep talking to thals.") }}</div>
          </h2>

          <form action="/api/payment/stripe/create-portal-session" method="POST">
            <Button size="xs" class="bg-yellow-500 rounded-full">
              <span class="flex text-black items-center justify-center gap-1">
                <Icon name="material-symbols:subscriptions-outline" />
                <span class="whitespace-nowrap">{{ t("Renew Thal") }}</span>
              </span>
            </Button>
          </form>
        </div>
      </AppNote>

      <div v-if="chats?.length" class="px-4 py-2">
        <SearchField
          :placeholder="t('Search name or username...')"
          path="search"
          autofocus
        />
      </div>

      <div class="flex-1 overflow-y-auto bg-white">
        <StyledResource
          :loading="isPending"
          :error="isError"
          @execute="refetch"
        >
          <ChatListEmpty v-if="!chats?.length && !chatItemSearch.trim()" />

          <template v-else-if="!chats?.length">
            <p class="text-gray-500 text-sm py-2 px-6 text-center">
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
        </StyledResource>
      </div>

      <div class="absolute bottom-4 right-4">
        <Button shape="circle" class="border-none bg-cyan-500" @click="drawers.newChat = true">
          <Icon name="material-symbols:add" />
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-gradient-1 {
  background: linear-gradient(50deg, theme('colors.magenta.500'), theme('colors.red.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

.text-gradient-2 {
  background: linear-gradient(50deg, theme('colors.red.500'), theme('colors.orange.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}

.border-gradient-1 {
  @apply border-none bg-red-500 text-orange-500;
  @apply bg-gray-50;
}
</style>
