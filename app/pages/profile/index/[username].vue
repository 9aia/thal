<script setup lang="ts">
import { t } from "@psitta/vue"

const user = useUser()
const route = useRoute()

const username = route.params.username

const { execute, data, pending, error } = useAsyncData(
  "profiles",
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
      <template #title="{ isNotFound }">
        <div class="space-y-2">
          <div>
            {{
              isNotFound
                ? t("User not found:")
                : t("Something wrong happened")
            }}
          </div>

          <div class="text-white text-sm">
            {{
              isNotFound
                ? username
                : ''
            }}
          </div>
        </div>
      </template>
    </Error>
  </div>

  <div
    v-else
    class="bg-slate-300 flex flex-col sm:flex-row md:flex-col lg:flex-row min-h-screen"
  >
    <aside
      class="w-full sm:w-full lg:w-1/2 p-4 pb-12 shadow-lg sm:shadow-none"
    >
      <Header />
      <Summary />

      <A
        v-if="user!.username === profile!.username"
        href="/settings/profile"
        class="btn btn-sm mt-4"
      >{{ t("Edit profile") }}</A>
    </aside>

    <main
      class="w-full sm:w-full lg:w-1/2 p-4 space-y-6 divide-y divide-gray-400"
    >
      <AboutMe />
      <Goals />
      <Interests />
      <Observation />
    </main>
  </div>
</template>
