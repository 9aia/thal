<script setup lang="ts">
import { useProfileModal } from "~/composables/useProfileModal"

const { profileModalState } = useProfileModal()

const drawers = reactive({
  profile: false,
  account: false,
  settings: false,
  newChat: false,
  personaBuilder: false,
  newContact: false,
})

function handleMenuClick(type: string) {
  if (type === "settings-drawer")
    drawers.settings = true
  else if (type === "profile-drawer")
    drawers.profile = true
  else if (type === "account-drawer")
    drawers.account = true
  else if (type === "new-chat")
    drawers.newChat = true
  else if (type === "build-persona-drawer")
    drawers.personaBuilder = true
  else if (type === "new-contact-drawer")
    drawers.newContact = true
}

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
            <Home @open="handleMenuClick" @close="isRootDrawerOpen = false" />

            <template #footer>
              <Drawer :model-value="drawers.settings">
                <Settings
                  @open="handleMenuClick"
                  @close="drawers.settings = false"
                />

                <template #footer>
                  <Drawer
                    v-slot="{ close }"
                    v-model="drawers.account"
                  >
                    <AccountSettings @close="close" />
                  </Drawer>

                  <Drawer
                    v-slot="{ close }"
                    v-model="drawers.profile"
                  >
                    <ProfileSettings @close="close" />
                  </Drawer>
                </template>
              </Drawer>

              <Drawer :model-value="drawers.newChat">
                <NewChat
                  @open="handleMenuClick"
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
