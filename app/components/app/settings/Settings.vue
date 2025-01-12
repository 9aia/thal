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

onMounted(() => {
  const redirectUrl = useRedirectUrl()
  redirectUrl.value = '/app'
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-gradient-1 flex items-center gap-1">
        <Button size="sm" class="btn-ghost" shape="circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Button>
        {{ t("Settings") }}
      </h1>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <div
        role="button" class="group bg-gradient-1 p-4 flex justify-between items-center transition duration-300"
        @click="drawers.profile = true"
      >
        <div class="flex gap-4 items-center">
          <Avatar :name="user?.name" class="w-16 text-md" />

          <label class="relative cursor-pointer flex flex-col gap-0">
            <h2 class="text-lg">{{ user?.name }}</h2>

            <small class="text-magenta-500">
              {{ t("Show profile") }}
            </small>
          </label>
        </div>

        <ChevronRight />
      </div>

      <div class="space-y-4 px-4 py-4">
        <SettingSection :title="t('General')">
          <MenuGroup
            class="p-0 w-full shadow-none"
            item-class="py-2"
            :items="SETTINGS.general"
          >
            <template #footer>
              <li class="group" @click="isLocaleModalOpen = true">
                <div>
                  <div class="cursor-pointer flex w-full gap-2 justify-between items-center">
                    <MenuItem
                      :is="{ id: 'language', name: 'Language', icon: 'globe', type: 'accordion' }"
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
            item-class="py-2"
            :items="SETTINGS.support"
          />
        </SettingSection>

        <SettingSection :title="t('Legal')">
          <MenuGroup
            class="p-0 w-full shadow-none"
            item-class="py-2"
            :items="SETTINGS.legal"
          />
        </SettingSection>

        <section>
          <button class="underline font-bold text-warning mb-2" @click="logout">
            {{ t("Logout") }}
          </button>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-1 {
  background: radial-gradient(circle at bottom, theme('colors.magenta.50'), theme('colors.white'));
}

.text-gradient-1 {
  background: radial-gradient(theme('colors.blue.500'), theme('colors.cyan.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
