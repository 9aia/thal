<script setup lang="ts">
import { drawers, isRootDrawerOpen, rightDrawer } from '~/store'
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
            <Home @close="drawers.newChat = false" />

            <template #footer>
              <Drawer v-slot="{ close }" :model-value="drawers.settings">
                <Settings @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.newChat">
                <NewChat @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.myPersonas">
                <MyPersonas @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.profile">
                <Profile @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.profileSettings">
                <ProfileSettings @close="close" />
              </Drawer>

              <Drawer v-slot="{ close }" v-model="drawers.account">
                <AccountSettings @close="close" />
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
