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
const user = ref(data.value)
provide('user', user)
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
        v-if="c.user!.username === user.username"
        href="/app/settings/profile"
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
