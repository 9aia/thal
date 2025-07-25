<script setup lang="ts">
import { t } from '@psitta/vue'
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import { chatListSearch } from '~/store'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()
const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)
const chatsQuery = useChatsQuery()
await chatsQuery.suspense()

const displayNotice = computed(() => user.value?.subscriptionStatus === SubscriptionStatus.active || user.value?.subscriptionStatus === SubscriptionStatus.trialing)

const form = useForm({
  initialValues: {
    search: '',
  },
})

watchDebounced(toRef(() => form.values.search), () => {
  chatListSearch.value = form.values.search
}, { debounce: 500 })
</script>

<template>
  <div class="bg-white flex flex-col h-dvh justify-between w-full absolute">
    <Navbar
      hide-title
      hide-back="always"
    >
      <div class="flex gap-2 items-center">
        <h1 class="flex items-center gap-2">
          <A
            class="text-lg text-black cursor-pointer border-y-2 border-y-transparent focus:border-b-primary focus:outline-hidden"
            href="/app"
            @click="sidebar.open.value = false"
            @keydown.enter="sidebar.open.value = false"
          >
            {{ t('Thal') }}
          </A>

          <ReleaseBadge />
        </h1>
      </div>

      <div class="flex gap-1 items-center translate-x-2 z-50">
        <CommonMenuButton />

        <Button
          as="label"
          for="sidebar-drawer"
          class="btn btn-neutral btn-circle btn-ghost lg:hidden"
          no-disable-on-loading
          icon="material-symbols:arrow-menu-close-rounded"
        />
      </div>
    </Navbar>

    <div class="flex-1 overflow-y-auto">
      <ChatListFeedbackAppNote v-if="displayNotice" />

      <div class="pb-1 sticky top-0 bg-white z-10 space-y-2">
        <ChatListSubscriptionAppNote v-if="!displayNotice" />

        <form
          v-if="(chatsQuery.data.value && chatsQuery.data.value.length > 1 || chatListSearch?.trim() !== '') || (chatsQuery.isLoading.value)"
          class="px-6"
        >
          <SearchField
            v-model="form.values.search"
            :placeholder="t('Search name or username...')"
            path="search"
            autofocus
            input-class="input-lg input-primary w-full"
          />
        </form>
      </div>

      <SettingSection
        body-class="px-4 space-y-1 pt-1"
      >
        <ChatItemList />
      </SettingSection>

      <div class="absolute bottom-6 right-6">
        <Button
          class="btn btn-lg btn-circle btn-primary"
          icon="material-symbols:add-rounded"
          @click="sidebar.push('new-chat')"
        />
      </div>
    </div>
  </div>
</template>
