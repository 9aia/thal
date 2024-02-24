<script setup lang="ts">
import Avatar from '#lib/daisy/components/display/Avatar.vue'
import ChevronRight from '#lib/daisy/components/layout/ChevronRight.vue'
import MenuGroup from '#lib/daisy/components/layout/MenuGroup.vue'
import MenuItem from '#lib/daisy/components/layout/MenuItem.vue'
import { t } from '#lib/i18n'
import A from '#lib/vike/components/A.vue'
import { inject, ref } from 'vue'
import type { Profile } from '~/app/profile/schemas/profile'
import { SETTINGS } from '../../constants'
import LocaleModal from '../../modals/LocaleModal.vue'

const profile = inject<Profile>('profile')!

const isLocaleModalOpen = ref(false)
</script>

<template>
  <h1 class="text-4xl font-bold mb-4 ml-2">
    {{ t("Settings") }}
  </h1>

  <A
    href="/app/profile"
    class="group mb-6 shadow-lg bg-base-100 p-4 rounded-lg flex justify-between items-center transition duration-300 hover:shadow-2xl"
  >
    <div class="flex gap-4 items-center">
      <Avatar :name="profile.name" class="w-16 text-md" />

      <label class="relative cursor-pointer flex flex-col gap-0">
        <h2 class="text-lg font-bold">{{ profile.name }}</h2>
        <small class="text-gray-600">
          {{ t("Show profile") }}
        </small>
      </label>
    </div>

    <ChevronRight />
  </A>

  <div class="space-y-4">
    <section>
      <h2 class="text-teal-900 font-bold text-2xl ml-2 mb-3">
        {{ t("General") }}
      </h2>
      <MenuGroup class="p-0 w-full shadow-none" :items="SETTINGS.general">
        <template #footer>
          <li class="group" @click="isLocaleModalOpen = true">
            <div
              class="px-2 rounded-lg hover:bg-base-200"
            >
              <div
                class="cursor-pointer flex w-full gap-2 justify-between items-center py-2"
              >
                <MenuItem
                  :is="{ id: 'language', name: 'Language', icon: 'globe' }"
                />
              </div>
            </div>
          </li>
        </template>
      </MenuGroup>

      <LocaleModal v-model="isLocaleModalOpen" />
    </section>

    <section>
      <h2 class="text-teal-900 font-bold text-lg ml-2 mb-3">
        {{ t("Support") }}
      </h2>
      <MenuGroup :items="SETTINGS.support" />
    </section>

    <section>
      <h2 class="text-teal-900 font-bold text-lg ml-2 mb-3">
        {{ t("Legal") }}
      </h2>
      <MenuGroup class="p-0 w-full shadow-none" :items="SETTINGS.legal" />
    </section>

    <section>
      <form action="/api/auth/logout" class="ml-2">
        <button class="underline font-bold text-warning">
          {{ t("Logout") }}
        </button>
      </form>
    </section>
  </div>
</template>
