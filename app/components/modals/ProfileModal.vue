<script setup lang="ts">
import { useI18n } from "@psitta/vue"

const props = defineProps<{
  username: string | null
}>()

const { t } = useI18n()

const user = useUser()

const { execute, data, pending, error } = useAsyncData(
  `profile-${props.username}`,
  async () => {
    const profileFetched = await $fetch(`/api/profile/${props.username}`)
    return profileFetched
  },
  { immediate: false },
)

const profile = ref<typeof data["value"]>()

const isMe = computed(() => user.value!.username === props.username)

async function loadProfile() {
  console.log(user.value, "user")

  if (isMe.value) {
    profile.value = user.value!

    return
  }

  await execute()

  profile.value = data.value!
}

const isLoading = computed(() => {
  if (isMe.value)
    return !profile.value
  else
    return !profile.value || pending.value
})

const modelValue = defineModel({ default: false })

watch(modelValue, (value) => {
  if (value)
    loadProfile()
}, { immediate: true })

function goToEdit() {
  modelValue.value = false
  navigateTo("/app/settings/profile")
}

provide("profile", profile)
</script>

<template>
  <Modal
    v-model="modelValue"
    :hide-confirm="true"
    :show-close-button="true"
    classes="min-h-[600px] max-h-[600px]"
  >
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("Profile") }}
      </h1>

      <div v-if="isLoading" class="flex justify-center items-center h-full">
        <Spinner size="sm" />
      </div>

      <div v-else-if="!!error" class="flex justify-center items-center h-full">
        <Error
          :error="error"
          @try-again="loadProfile"
        >
          <template #title="{ isNotFound, isForbidden }">
            <div class="space-y-2">
              <div>
                <div v-if="isNotFound">
                  {{ t("User not found:") }}
                </div>

                <div v-else-if="isForbidden">
                  {{ t("Forbidden for user: ") }}
                </div>

                <div v-else>
                  {{ t("Something wrong happened") }}
                </div>
              </div>

              <div class="text-white text-sm">
                <div v-if="isNotFound || isForbidden">
                  {{ username }}
                </div>
              </div>
            </div>
          </template>

          <template #action="{ tryAgainFn, isForbidden, isNotFound }">
            <Btn
              v-if="!isNotFound && !isForbidden"
              class="btn-primary"
              @click="tryAgainFn()"
            >
              <Icon name="mdi-refresh" />
              {{ t('Try again') }}
            </Btn>

            <Btn
              v-else
              class="btn-primary"
              @click="navigateTo('/app/profile/')"
            >
              <Icon name="mdi-refresh" />
              {{ t('Go to my profile') }}
            </Btn>
          </template>
        </Error>
      </div>

      <div
        v-else
        class="bg-slate-300 flex flex-col h-full overflow-auto"
      >
        <aside class="w-full pb-2 shadow-lg sm:shadow-none">
          <Header @edit="goToEdit" />
        </aside>

        <main class="w-full space-y-6 divide-y divide-base-200">
          <AboutMe />
          <Goals />
          <Interests />
          <Observation />
        </main>
      </div>
    </template>
  </Modal>
</template>
