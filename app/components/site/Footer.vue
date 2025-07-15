<script setup lang="ts">
import { type Value, formatValue } from '@psitta/core'
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'
import { isWhatsNewModalOpen } from '~/store'

const user = useUser()
const localeModal = useLocaleModal()
const logout = useLogout()
</script>

<template>
  <footer class="sticky top-[100vh] bg-white">
    <div class="z-20 text-black w-full py-4 flex flex-col gap-1 max-w-[800px] mx-auto px-4">
      <div class="flex gap-2 items-center justify-between w-full">
        <div class="flex items-center gap-4 justify-center">
          <A href="/" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit">
            {{ t('Home') }}
          </A>

          <A v-if="!user?.plan == null" href="/pricing" active-class="text-gray-200" class="flex items-center gap-1 text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit">
            {{ t('Pricing') }}
          </A>
        </div>

        <div class="flex gap-4">
          <Link
            href="/terms"
            active-class="text-gray-200"
            class="flex items-center gap-1 text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit"
          >
            {{ t('Terms') }}
          </Link>

          <Link
            href="/privacy"
            active-class="text-gray-200"
            class="flex items-center gap-1 text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit"
          >
            {{ t('Privacy') }}
          </Link>

          <Link
            href="/security"
            active-class="text-gray-200"
            class="flex items-center gap-1 text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit"
          >
            {{ t('Security') }}
          </Link>
        </div>
      </div>

      <div class="flex gap-2 items-center justify-between w-full">
        <div class="flex gap-4">
          <Link
            href="https://forms.gle/UyGBzPrBeNfFgwLD6"
            :localize="false"
            target="_blank"
            class="flex items-center gap-1 !text-black border-y-2 border-transparent focus:border-b-blue-500 focus:outline-none w-fit"
          >
            {{ t('Send feedback') }}
          </Link>

          <Link
            v-if="user"
            href="https://forms.gle/yHaiExzsQvv1mTdM8"
            :localize="false"
            target="_blank"
            class="flex items-center gap-1 !text-black border-y-2 border-transparent focus:border-b-blue-500 focus:outline-none w-fit"
          >
            {{ t('Rate Thal') }}
          </Link>
        </div>

        <div class="flex items-center gap-4 justify-center">
          <Link
            href="mailto:thal@9aia.com"
            active-class="text-gray-200"
            class="flex items-center gap-1 text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit"
          >
            thal@9aia.com
          </Link>
        </div>
      </div>

      <div class="flex gap-2 items-center justify-between w-full">
        <div>
          <Button
            class="flex items-center gap-1 text-black border-y-2 border-transparent focus:border-b-blue-500 focus:outline-none w-fit cursor-pointer"
            icon="material-symbols:campaign-outline-rounded"
            @click="isWhatsNewModalOpen = true"
          >
            {{ t('What\'s new') }}
          </Button>
        </div>

        <div class="flex items-center gap-1 justify-center">
          <A
            href="/app"
            class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-primary focus:outline-2 focus:outline-offset-2"
          >
            <Icon name="material-symbols:chat-outline-rounded" />
          </A>

          <A
            v-if="user"
            class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-primary focus:outline-2 focus:outline-offset-2"
            href="/settings/account"
          >
            <Icon name="material-symbols:settings-outline-rounded" />
          </A>

          <Button
            class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-primary focus:outline-2 focus:outline-offset-2"
            icon="material-symbols:language"
            @click="localeModal.open()"
          />

          <Button
            v-if="user"
            class="flex items-center !text-warning border-y-2 border-transparent focus:border-b-blue-500 focus:outline-none w-fit cursor-pointer"
            icon="material-symbols:logout-rounded"
            @click="logout()"
          >
            {{ t('Logout') }}
          </Button>
        </div>
      </div>

      <div class="flex gap-4 items-center justify-between w-full mt-4">
        <!-- Social icons -->
        <!-- <div class="flex items-center gap-1">
        <Button
          as="a"
          href="https://www.instagram.com/thal.app"
          target="_blank"
          icon="logos:instagram-icon"
          class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-primary focus:outline-2 focus:outline-offset-2"
          icon-class="fill-black text-xl"
        />

        <Button
          as="a"
          href="https://www.twitter.com/thal.app"
          target="_blank"
          icon="logos:x"
          class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-primary focus:outline-2 focus:outline-offset-2"
          icon-class="fill-black text-xl"
        />
      </div> -->
        <div class="flex items-center gap-1">
          <T
            text="{year} - Developed at {orgName}"
            :values="{ year: [new Date(), { year: 'numeric' }], orgName: '9aia' }"
            class="flex items-center justify-center gap-1"
          >
            <template #year="slotProps">
              <span class="text-gray-500">
                {{ formatValue(slotProps.year as Value) }}
              </span>
            </template>

            <template #orgName="slotProps">
              <Link href="https://9aia.com" disable class="!text-blue-500 flex items-center gap-1 border-y-2 border-transparent focus:border-b-blue-500 focus:outline-none">
                {{ slotProps.orgName }}
              </Link>
            </template>
          </T>
        </div>
      </div>
    </div>
  </footer>
</template>
