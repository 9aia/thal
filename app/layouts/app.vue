<script setup lang="ts">
import NewChatDrawer from "~/components/app/new-chat/NewChatDrawer.vue"
import SettingsDrawer from "~/components/app/settings/index/SettingsDrawer.vue"
import { useProfileModal } from "~/composables/useProfileModal"

const { profileModalState } = useProfileModal()
</script>

<template>
  <div class="w-full mx-auto max-w-[1700px]">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh">
        <slot name="content" />
      </div>

      <div class="drawer-side">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="flex flex-col h-dvh justify-between w-full sm:w-96">
          <ProfileDrawer>
            <AccountDrawer>
              <SettingsDrawer>
                <NewChatDrawer>
                  <slot name="side" />
                </NewChatDrawer>
              </SettingsDrawer>
            </AccountDrawer>
          </ProfileDrawer>
        </div>
      </div>
    </div>

    <ClientOnly>
      <ProfileModal v-model="profileModalState.modelValue" :username="profileModalState.username" />
    </ClientOnly>
  </div>
</template>

<style>
body {
  @apply bg-slate-300;
}

* {
  scrollbar-width: thin;
}
</style>
