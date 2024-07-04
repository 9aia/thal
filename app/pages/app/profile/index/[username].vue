<script setup lang="ts">
import { t } from "@psitta/vue"

const user = useUser()
const route = useRoute()

const username = route.params.username

const { execute, data, pending, error } = useAsyncData(
  `profile-${username}`,
  async () => {
    const profileFetched = await $fetch(`/api/profile/${username}`)
    return profileFetched
  },
  { immediate: false },
)

const profile = ref<typeof data["value"]>()

async function loadProfile() {
  const isMe = user.value!.username === username

  if (isMe) {
    profile.value = user.value!

    return
  }

  await execute()

  profile.value = data.value!
}

const isLoading = computed(() => !profile.value && pending.value)

loadProfile()

definePageMeta({
  middleware: "premium",
  layout: "app",
})

provide("profile", profile)
</script>

<template>
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
    <aside
      class="w-full p-4 pb-2 shadow-lg sm:shadow-none"
    >
      <Header />
      <!-- <Summary /> -->

      <A
        v-if="user!.username === profile!.username"
        href="/app/settings/profile"
        class="btn btn-sm mt-4"
      >{{ t("Edit profile") }}</A>
    </aside>

    <main
      class="w-full p-4 space-y-6 divide-y divide-gray-400"
    >
      <AboutMe />
      <Goals />
      <Interests />
      <Observation />
    </main>
  </div>
</template>
