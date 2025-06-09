<script setup lang="ts">
import { t } from '@psitta/vue'
import { ref } from 'vue'
import { SETTINGS } from '~/constants/settings'
import { drawers } from '~/store'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const isLocaleModalOpen = ref(false)

const user = useUser()
const logout = useLogout()

useAutoRedirect({
  query: { drawer: ['settings'] },
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar :title="t('Settings')" @click="emit('close')" />

    <div class="flex-1 overflow-y-auto bg-white mt-2">
      <div
        role="button"
        class="cursor-pointer group bg-radial-[circle_at_bottom] from-magenta-50 to-gray-50 p-6 flex justify-between items-center transition duration-300"
        @click="drawers.profile = true"
      >
        <div class="flex gap-4 items-center">
          <Avatar
            :name="user?.name"
            wrapper-class="bg-white text-neutral-content"
            size="lg"
          />

          <label class="relative cursor-pointer flex flex-col gap-0">
            <h2 class="text-lg">{{ user?.name }}</h2>

            <small class="text-magenta-500">
              {{ t("Show profile") }}
            </small>
          </label>
        </div>

        <ChevronRight />
      </div>

      <div class="space-y-4 p-6">
        <SettingSection :title="t('General')">
          <MenuGroup
            class="p-0 w-full shadow-none"
            :items="SETTINGS.general"
          >
            <template #footer>
              <li class="group" @click="isLocaleModalOpen = true">
                <div>
                  <div class="cursor-pointer flex w-full gap-2 justify-between items-center">
                    <MenuItem
                      :is="{ id: 'language', name: 'Language', icon: 'material-symbols:globe', type: 'accordion' }"
                      class="py-2"
                    />
                  </div>
                </div>
              </li>
            </template>
          </MenuGroup>

          <LocaleModal v-model="isLocaleModalOpen" />
        </SettingSection>

        <SettingSection :title="t('Support')">
          <MenuGroup
            :items="SETTINGS.support"
          />
        </SettingSection>

        <SettingSection :title="t('Legal')">
          <MenuGroup
            class="p-0 w-full shadow-none"
            :items="SETTINGS.legal"
          />
        </SettingSection>

        <section>
          <button class="underline text-warning mb-2" @click="logout">
            {{ t("Logout") }}
          </button>
        </section>
      </div>
    </div>
  </div>
</template>
