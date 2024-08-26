<script setup lang="ts">
import { drawers } from "~/store"
import { useProfileModal } from "~/composables/useProfileModal"

const { profileModalState } = useProfileModal()

const isRootDrawerOpen = ref(false)
</script>

<template>
  <div class="w-full mx-auto max-w-[1700px]">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer" v-model="isRootDrawerOpen" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh">
        <slot name="content" />
      </div>

      <div class="drawer-side">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="flex flex-col h-dvh justify-between w-full sm:w-96">
          <Drawer :model-value="true">
            <Home @close="isRootDrawerOpen = false" />

            <template #footer>
              <Drawer :model-value="drawers.settings">
                <Settings @close="drawers.settings = false" />

                <template #footer>
                  <Drawer
                    v-slot="{ close }"
                    v-model="drawers.account"
                  >
                    <AccountSettings @close="close" />
                  </Drawer>
                </template>
              </Drawer>

              <Drawer :model-value="drawers.newChat">
                <NewChat
                  @close="drawers.newChat = false"
                />

                <template #footer>
                  <Drawer
                    v-slot="{ close }"
                    v-model="drawers.personaBuilder"
                  >
                    <BuildPersona @close="close" />
                  </Drawer>

                  <Drawer
                    v-slot="{ close }"
                    v-model="drawers.newContact"
                  >
                    <NewContact @close="close" />
                  </Drawer>
                </template>
              </Drawer>

              <Drawer
                v-slot="{ close }"
                v-model="drawers.profile"
              >
                <ProfileSettings @close="close" />
              </Drawer>
            </template>
          </Drawer>
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
