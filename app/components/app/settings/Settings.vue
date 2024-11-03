<script setup lang="ts">
import { t } from "@psitta/vue"
import { ref } from "vue"
import { SETTINGS } from "~/constants/settings"

const emit = defineEmits<{
  (e: "close"): void
}>()

const { open: openProfile } = useProfileModal()

const isLocaleModalOpen = ref(false)

const user = useUser()
const logout = useLogout()

onMounted(() => {
  const redirectUrl = useRedirectUrl()
  redirectUrl.value = "/app"
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        <Btn size="sm" class="btn-ghost btn-circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Btn>
        {{ t("Settings") }}
      </h1>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <div
        role="button" class="group bg-slate-200 p-4 flex justify-between items-center transition duration-300"
        @click="openProfile(user!.username)"
      >
        <div class="flex gap-4 items-center">
          <Avatar :name="user!.name" class="w-16 text-md" />

          <label class="relative cursor-pointer flex flex-col gap-0">
            <h2 class="text-lg font-bold">{{ user!.name }}</h2>

            <small class="text-primary">
              {{ t("Show profile") }}
            </small>
          </label>
        </div>

        <ChevronRight />
      </div>

      <div class="space-y-4 px-4 py-4">
        <SettingSection :title="t('General')">
          <MenuGroup class="p-0 w-full shadow-none" :items="SETTINGS.general">
            <template #footer>
              <li class="group" @click="isLocaleModalOpen = true">
                <div>
                  <div class="cursor-pointer flex w-full gap-2 justify-between items-center py-2">
                    <MenuItem :is="{ id: 'language', name: 'Language', icon: 'globe', type: 'accordion' }" />
                  </div>
                </div>
              </li>
            </template>
          </MenuGroup>

          <LocaleModal v-model="isLocaleModalOpen" />
        </SettingSection>

        <SettingSection :title="t('Support')">
          <MenuGroup :items="SETTINGS.support" />
        </SettingSection>

        <SettingSection :title="t('Legal')">
          <MenuGroup class="p-0 w-full shadow-none" :items="SETTINGS.legal" />
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
