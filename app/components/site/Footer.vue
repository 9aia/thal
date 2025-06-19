<script setup lang="ts">
import { type Value, formatValue } from '@psitta/core'
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'

const user = useUser()
const localeModal = useLocaleModal()
const logout = useLogout()
</script>

<template>
  <footer class="sticky top-[100vh]">
    <div class="z-20 bg-white text-black w-full py-4">
      <div class="mx-auto max-w-[800px] px-4 flex gap-2 flex-wrap items-center justify-between">
        <div class="flex items-center justify-center gap-4">
          <A href="/" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline focus:outline-none border-b-2 border-transparent focus:border-blue-500">
            {{ t('Home') }}
          </A>

          <A v-if="!user?.plan == null" href="/pricing" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline focus:outline-none border-b-2 border-transparent focus:border-blue-500">
            {{ t('Pricing') }}
          </A>

          <A href="/terms" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline focus:outline-none border-b-2 border-transparent focus:border-blue-500">
            {{ t('Terms') }}
          </A>

          <A href="/privacy" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline focus:outline-none border-b-2 border-transparent focus:border-blue-500">
            {{ t('Privacy') }}
          </A>
        </div>

        <div class="flex items-center justify-center gap-1">
          <A class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-primary focus:outline-2 focus:outline-offset-2" href="/app">
            <Icon name="material-symbols:chat-outline-rounded" />
          </A>
          <A v-if="user" class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-primary focus:outline-2 focus:outline-offset-2" href="/settings/account">
            <Icon name="material-symbols:settings-outline-rounded" />
          </A>
          <Button
            class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-primary focus:outline-2 focus:outline-offset-2"
            icon="material-symbols:language"
            @click="localeModal.open()"
          />
          <Button
            v-if="user"
            class="cursor-pointer rounded-full p-1 text-orange-500 hover:text-orange-600 flex focus:outline-primary focus:outline-2 focus:outline-offset-2"
            icon="material-symbols:logout-rounded"
            @click="logout()"
          />
        </div>
      </div>

      <div class="max-w-[800px] mx-auto px-4 pb-4 mt-2 flex flex-col md:flex-row flex-wrap md:flex-nowrap gap-2 justify-between items-center">
        <div class="flex gap-4 w-full items-center flex-wrap">
          <Link :href="t('https://forms.gle/5ePvXjrebyWGUrM26')" :localize="false" target="_blank" class="flex items-center gap-1 !text-black border-b-2 border-transparent focus:border-blue-500 focus:outline-none">
            {{ t('Give us feedback') }}
          </Link>

          <Link :href="t('https://forms.gle/ANMv7qnwTHva1k7L8')" :localize="false" target="_blank" class="flex items-center gap-1 !text-black border-b-2 border-transparent focus:border-blue-500 focus:outline-none">
            {{ t('Report a problem') }}
          </Link>
        </div>

        <div class="flex w-full items-center mt-2 md:justify-end gap-1">
          <T
            text="{year} - Developed by {teamName}"
            :values="{ year: [new Date(), { year: 'numeric' }], teamName: 'Gaia' }"
            class="flex items-center justify-center gap-1"
          >
            <template #year="slotProps">
              <span class="text-gray-500">
                {{ formatValue(slotProps.year as Value) }}
              </span>
            </template>

            <template #teamName="slotProps">
              <Link href="https://9aia.github.io/" disable class="!text-blue-500 flex items-center gap-1 border-b-2 border-transparent focus:border-blue-500 focus:outline-none">
                {{ slotProps.teamName }}
              </Link>
            </template>
          </T>
        </div>
      </div>
    </div>
  </footer>
</template>
