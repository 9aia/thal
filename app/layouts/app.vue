<script setup lang="ts">
import { drawers, isPastDueModalAlreadyShown, isPastDueModalOpen, isRootDrawerOpen, rightDrawer } from '~/store'
import { SubscriptionStatus } from '~~/db/schema'

const user = useUser()

onMounted(() => {
  const isPastDue = user.value?.subscriptionStatus === SubscriptionStatus.past_due

  if (isPastDue && !isPastDueModalAlreadyShown.value) {
    isPastDueModalOpen.value = true
  }

  isPastDueModalAlreadyShown.value = isPastDue
})
</script>

<template>
  <div class="w-full mx-auto max-w-[1700px] h-full">
    <div class="drawer lg:drawer-open">
      <input id="my-drawer" v-model="isRootDrawerOpen" type="checkbox" class="drawer-toggle">

      <div class="drawer-content flex flex-col h-dvh">
        <div class="drawer drawer-end">
          <input id="my-drawer-4" v-model="rightDrawer" type="checkbox" class="drawer-toggle">

          <div class="drawer-content flex flex-col h-dvh bg-white overflow-auto">
            <slot name="content" />
          </div>
          <div class="drawer-side z-[100]">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay" />

            <div class="flex flex-col h-dvh items-end justify-center w-full sm:w-96">
              <ContactViewDrawer v-if="rightDrawer" />
            </div>
          </div>
        </div>
      </div>

      <div class="drawer-side z-50">
        <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay" />

        <div class="flex flex-col h-dvh justify-between w-[80%] sm:w-96">
          <Drawer :model-value="true">
            <ChatListDrawer @close="drawers.newChat = false" />

            <template #footer>
              <Drawer v-slot="{ close }" v-model="drawers.settings">
                <SettingsDrawer @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.newChat">
                <NewChatDrawer @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.myCharacters">
                <MyCharactersDrawer @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.profile">
                <ProfileDrawer @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.accountSettings">
                <AccountSettingsDrawer @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.characterBuilder">
                <CharacterBuilderDrawer @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.contactManager">
                <ContactManagerDrawer @close="close" />
              </Drawer>
            </template>
          </Drawer>
        </div>
      </div>
    </div>
  </div>
</template>
