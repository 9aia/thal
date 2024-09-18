<script setup lang="ts">
import { drawers, rightDrawer } from "~/store"
import { useProfileModal } from "~/composables/useProfileModal"
import { useDiscoverPersonasModal } from "~/composables/useDiscoverPersonasModal"

const { profileModalState } = useProfileModal()
const { discoverPersonasModalState } = useDiscoverPersonasModal()

const isRootDrawerOpen = ref(false)
</script>

<template>
  <div class="w-full mx-auto max-w-[1700px]">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer" v-model="isRootDrawerOpen" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh">
        <div class="drawer drawer-end">
          <input id="my-drawer-4" v-model="rightDrawer" type="checkbox" class="drawer-toggle">
          <div class="drawer-content flex flex-col h-dvh">
            <slot name="content" />
          </div>
          <div class="drawer-side">
            <div class="flex flex-col h-dvh justify-between">
              <ContactView v-if="rightDrawer" />
            </div>
          </div>
        </div>
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
                  <Drawer v-slot="{ close }" v-model="drawers.account">
                    <AccountSettings @close="close" />
                  </Drawer>
                </template>
              </Drawer>

              <Drawer :model-value="drawers.newChat">
                <NewChat @close="drawers.newChat = false" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.myPersonas">
                <MyPersonas @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.profile">
                <ProfileSettings @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.personaBuilder">
                <BuildPersona @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.newContact">
                <NewContact @close="close" />
              </Drawer>
            </template>
          </Drawer>
        </div>
      </div>
    </div>

    <ClientOnly>
      <ProfileModal v-model="profileModalState.modelValue" :username="profileModalState.username" />
      <DiscoverPersonasModal v-model="discoverPersonasModalState.modelValue" />
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
