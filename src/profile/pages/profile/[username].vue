<script setup lang="ts">
import A from '~/src/base/components/A.vue'
import { t } from '~/lib/psitta/vue'
import AboutMe from '../../components/AboutMe.vue'
import Goals from '../../components/Goals.vue'
import Header from '../../components/Header.vue'
import Interests from '../../components/Interests.vue'
import Observation from '../../components/Observation.vue'
import Summary from '../../components/Summary.vue'
import type { User } from 'lucia'

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

    const profile = await $fetch<User>('/api/profile', {
      params: {
        username,
      },
    })
    return profile
  }
)

definePageMeta({
  middleware: 'premium',
  layout: 'app',
})

const profileRef = ref(profile)
provide('profile', profileRef)
</script>

<template>
  <div
    class="bg-slate-300 flex flex-col sm:flex-row md:flex-col lg:flex-row"
    style="min-height: calc(100vh - 64px - 56px)"
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
