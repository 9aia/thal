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
          <A href="/" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline">
            {{ t('Home') }}
          </A>

          <A v-if="!user?.plan == null" href="/pricing" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline">
            {{ t('Pricing') }}
          </A>

          <A href="/terms" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline">
            {{ t('Terms') }}
          </A>

          <A href="/privacy" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline">
            {{ t('Privacy') }}
          </A>
        </div>

        <div class="flex items-center justify-center gap-2">
          <A class="flex" href="/app">
            <Icon name="material-symbols:chat-outline" />
          </A>
          <A v-if="user" class="flex" href="/settings/account">
            <Icon name="material-symbols:settings-outline" />
          </A>
          <Button
            class="flex cursor-pointer"
            icon="material-symbols:language-outline-rounded"
            @click="localeModal.open()"
          />
          <Button
            v-if="user"
            class="cursor-pointer flex text-orange-500"
            icon="material-symbols:logout-rounded"
            @click="logout()"
          />
        </div>
      </div>

      <div class="max-w-[800px] mx-auto px-4 pb-4 mt-2 flex flex-col md:flex-row flex-wrap md:flex-nowrap gap-2 justify-between items-center">
        <div class="flex gap-4 w-full items-center flex-wrap">
          <Link :href="t('https://forms.gle/5ePvXjrebyWGUrM26')" :localize="false" target="_blank" class="flex items-center gap-1 !text-black">
            {{ t('Give us feedback') }}
          </Link>

          <Link :href="t('https://forms.gle/ANMv7qnwTHva1k7L8')" :localize="false" target="_blank" class="flex items-center gap-1 !text-black">
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
              <Link href="https://9aia.github.io/" disable class="!text-blue-500 flex items-center gap-1">
                {{ slotProps.teamName }}
              </Link>
            </template>
          </T>
        </div>
      </div>
    </div>
  </footer>
</template>
