<script setup lang="ts">
import { t } from '#lib/i18n'
import { useData } from '#lib/vike/composables/useData'
import { usePageContext } from '#lib/vike/composables/usePageContext'
import { provide, ref } from 'vue'
import type Data from './+data'
import AboutMe from './AboutMe.vue'
import Goals from './Goals.vue'
import Header from './Header.vue'
import Interests from './Interests.vue'
import Observation from './Observation.vue'
import Summary from './Summary.vue'
import A from '#lib/vike/components/A.vue'

const c = usePageContext()
const data = useData<typeof Data>()
const profile = ref(data.value)
provide('profile', profile)
</script>

<template>
  <div
    class="flex flex-col sm:flex-row"
    style="min-height: calc(100vh - 64px - 56px)"
  >
    <aside
      class="w-full md:w-1/2 lg:w-1/3 pt-4 pb-12 px-8 md:p-8 shadow-lg md:shadow-none"
    >
      <Header />
      <Summary />

      <A
        v-if="c.user!.username === profile.username"
        href="/app/settings/profile"
        class="btn btn-sm mt-4"
      >{{ t("Edit profile") }}</A>
    </aside>

    <main
      class="w-full md:w-1/2 lg:w-2/3 p-8 space-y-6 divide-y divide-gray-400"
    >
      <AboutMe />
      <Goals />
      <Interests />
      <Observation />
    </main>
  </div>
</template>
