<script setup lang="ts">
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
                <BuildPersonaDrawer>
                  <NewChatDrawer>
                    <slot name="side" />
                  </NewChatDrawer>
                </BuildPersonaDrawer>
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
