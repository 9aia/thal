<script setup lang="ts">
import A from '~/src/base/components/A.vue'
import { t } from '@psitta/vue'

const user = useUser()
const route = useRoute()
const { data: profile } = useAsyncData(
  'profiles',
  async () => {
    const username = route.params.username
    const isMe = user.value!.username === username

    if (isMe) {
      return user.value
    }

    const profile = await $fetch(`/api/profile/${username}` as '/api/profile/:username')
    return profile
  }
)

definePageMeta({
  middleware: 'premium',
  layout: 'app',
})

provide('profile', profile)
</script>

<template>
  <div
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
