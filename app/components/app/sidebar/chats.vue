<script setup lang="ts">
import { t } from '@psitta/vue'
import { watchDebounced } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { chatListSearch, isChatListDrawerOpen } from '~/store'

const user = useUser()
const sidebar = useSidebar()
const chatsQuery = useChatsQuery()
const isPastDueVisible = computed(() => isPlanPastDue(user.value!))

const form = useForm({
  initialValues: {
    search: '',
  },
})

watchDebounced(toRef(() => form.values.search), () => {
  chatListSearch.value = form.values.search
}, { debounce: 500 })

onMounted(() => {
  sidebar.clear()
})

function handleGoHome() {
  isChatListDrawerOpen.value = false
  navigateTo('/app/')
}
</script>

<template>
  <div class="bg-white flex flex-col h-dvh justify-between w-full absolute">
    <Navbar
      hide-title
      hide-back="always"
    >
      <div class="flex gap-2 items-center">
        <h1>
          <button
            class="flex items-center gap-2 justify-center text-lg font-medium text-black cursor-pointer border-b-2 border-b-transparent focus:border-b-primary focus:outline-hidden"
            @click="handleGoHome()"
          >
            {{ t('Thal') }}
            <ExperimentalBadge />
          </button>
        </h1>
      </div>

      <div class="flex gap-1 items-center translate-x-2 z-50">
        <CommonMenuButton />

        <Button
          class="btn btn-neutral btn-circle btn-ghost lg:hidden"
          no-disable-on-loading
          icon="material-symbols:arrow-menu-close-rounded"
          @click="isChatListDrawerOpen = false"
        />
      </div>
    </Navbar>

    <div class="flex-1 overflow-y-auto">
      <ChatListFeedbackAppNote v-if="!isPastDueVisible" />

      <div class="pb-1 sticky top-0 bg-white z-10 space-y-2">
        <ChatListPastDueAppNote v-if="isPastDueVisible" />

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
