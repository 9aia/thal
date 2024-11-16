<script lang="ts" setup>
import { T, useI18n } from "@psitta/vue"
import { useForm } from "vee-validate"
import { drawers, isRootDrawerOpen } from "~/store"

const emit = defineEmits<{
  (e: "close"): void
}>()

const { t } = useI18n()

const user = useUser()
const form = useForm()

watch(() => drawers.profile, (open) => {
  if (open) {
    form.setValues({
      about: user.value!.observation,
    })
  }
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        <Btn size="sm" class="btn-ghost btn-circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Btn>
        {{ t("Profile") }}
      </h1>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <Header @edit="drawers.account = true" />

      <div class="p-4 flex-1 space-y-4">
        <SettingSection class="space-y-4">
          <ProfileField :label="t('Name')" role="button" @click="drawers.account = true">
            <template #icon>
              <Icon class="text-primary">
                person
              </Icon>
            </template>

            <template #main>
              <div class="text-base text-slate-900">
                {{ user?.name }} {{ user?.lastName }}
              </div>
            </template>

            <template #footer>
              <span class="text-xs text-slate-500">
                {{ t('This name will be passed to the characters.') }}
              </span>
            </template>
          </ProfileField>

          <ProfileField :label="t('Username')" role="button" @click="drawers.account = true">
            <template #icon>
              <Icon class="text-primary">
                badge
              </Icon>
            </template>

            <template #main>
              <div class="text-base text-slate-900 mb-2">
                @{{ user?.username }}
              </div>
            </template>
          </ProfileField>

          <ProfileField :label="t('About')" disable-edit-button>
            <template #icon>
              <Icon class="text-primary">
                Info
              </Icon>
            </template>

            <template #main>
              <form class="w-full flex flex-col justify-end items-end space-y-2">
                <TextField path="about" class="mt-1" />

                <Btn class="btn-primary">
                  {{
                    t("Save")
                  }}
                </Btn>
              </form>
            </template>
          </ProfileField>
        </SettingSection>
      </div>
    </div>
  </div>
</template>
