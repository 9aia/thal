<script setup lang="ts">
import { type Value, formatValue } from '@psitta/core'
import { T, t } from '@psitta/vue'
import Link from '~/components/ui/navigation/Link.vue'
import { isWhatsNewModalOpen } from '~/store'

const user = useUser()
const localeModal = useLocaleModal()
const logout = useLogout()
const whatsNew = useWhatsNew()

const isReleaseModalOpen = ref(false)

const releaseType = useReleaseType()
</script>

<template>
  <footer class="sticky top-[100vh] bg-white pt-6">
    <LazyReleaseModal v-model="isReleaseModalOpen" />

    <div class="z-20 text-black w-full py-4 max-w-[800px] mx-auto px-4 ">
      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        <!-- Product Section -->
        <div class="space-y-4">
          <h3 class="text-gray-500">
            {{ t('Product') }}
          </h3>
          <div class="space-y-2">
            <Link
              href="/"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-600"
            >
              {{ t('Home') }}
            </Link>

            <Link
              href="/pricing"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-600"
            >
              {{ t('Pricing') }}
            </Link>

            <Link
              href="/app"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-600"
            >
              {{ t('Access app') }}
            </Link>

            <Button
              v-if="releaseType !== 'stable' && releaseType !== 'dev'"
              class="cursor-pointer flex text-left gap-1 text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit text-sm"
              @click="isReleaseModalOpen = true"
            >
              <template v-if="releaseType === 'preview'">
                {{ t('About preview') }}
              </template>
              <template v-if="releaseType === 'early-access'">
                {{ t('About early access') }}
              </template>
              <template v-if="releaseType === 'early-stable'">
                {{ t('About early stable') }}
              </template>
            </Button>

            <div class="relative w-fit">
              <span v-if="whatsNew.hasUnreadContent.value" class="absolute -right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full" />

              <Button
                class="flex text-left gap-1 text-black hover:text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit cursor-pointer text-sm"
                @click="isWhatsNewModalOpen = true"
              >
                {{ t('What\'s new') }}
              </Button>
            </div>
          </div>
        </div>

        <!-- Support Section -->
        <div class="space-y-4">
          <h3 class="text-gray-500">
            {{ t('Support') }}
          </h3>
          <div class="space-y-2">
            <Link
              href="/contact"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-700"
            >
              {{ t('Contact Us') }}
            </Link>
            <Link
              href="https://forms.gle/UyGBzPrBeNfFgwLD6"
              :localize="false"
              target="_blank"
              class="text-left gap-1 text-black w-fit text-sm"
            >
              {{ t('Send feedback') }}
            </Link>
            <Link
              v-if="user"
              href="https://forms.gle/yHaiExzsQvv1mTdM8"
              :localize="false"
              target="_blank"
              class="text-left gap-1 text-black w-fit text-sm"
            >
              {{ t('Rate Thal') }}
            </Link>
          </div>
        </div>

        <!-- Legal Section -->
        <div class="space-y-4">
          <h3 class="text-gray-500">
            {{ t('Legal') }}
          </h3>
          <div class="space-y-2">
            <Link
              href="/legal/terms-of-service"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-600"
            >
              {{ t('Terms of Service') }}
            </Link>
            <Link
              href="/legal/privacy-policy"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-600"
            >
              {{ t('Privacy Policy') }}
            </Link>
            <Link
              href="/legal/security-policy"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-600"
            >
              {{ t('Security Policy') }}
            </Link>
          </div>
        </div>

        <!-- Account Section -->
        <div class="space-y-4">
          <h3 class="text-gray-500">
            {{ t('Account') }}
          </h3>
          <div class="space-y-2">
            <Link
              v-if="!user"
              href="/sign-in"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-600"
            >
              {{ t('Sign in') }}
            </Link>

            <Link
              v-if="user"
              href="/settings/account"
              class="text-left gap-1 text-black w-fit text-sm"
              active-class="text-gray-600"
            >
              {{ t('Manage account') }}
            </Link>

            <form v-if="user" action="/api/payment/stripe/create-portal-session" method="post">
              <Button
                type="submit"
                class="cursor-pointer text-left flex items-center gap-1 text-black hover:underline focus:outline-none border-y-2 border-transparent focus:border-b-blue-500 w-fit text-sm"
              >
                {{ t('Manage subscription') }}
              </Button>
            </form>

            <Button
              v-if="user"
              class="flex text-left gap-1 text-black hover:text-black hover:underline border-y-2 border-transparent focus:border-b-blue-500 focus:outline-none w-fit cursor-pointer text-sm"
              @click="logout()"
            >
              {{ t('Logout') }}
            </Button>
          </div>
        </div>
      </div>

      <!-- Bottom Bar -->
      <div class="pt-6">
        <div class="flex flex-row gap-4 items-center justify-between">
          <!-- Copyright -->
          <div class="flex items-center gap-1">
            <T
              text="{year} - Developed at {orgName}"
              :values="{ year: [new Date(), { year: 'numeric' }], orgName: 'Gaia' }"
              class="flex items-center justify-center gap-1 text-sm text-black"
            >
              <template #year="slotProps">
                <span class="text-black">
                  {{ formatValue(slotProps.year as Value) }}
                </span>
              </template>

              <template #orgName="slotProps">
                <Link
                  href="https://9aia.com"
                  class="text-blue-500"
                >
                  {{ slotProps.orgName }}
                </Link>
              </template>
            </T>
          </div>

          <!-- Action Icons -->
          <div class="flex items-center gap-2">
            <Button
              class="btn btn-neutral btn-ghost btn-circle"
              icon="material-symbols:language"
              icon-class="text-black"
              @click="localeModal.open()"
            />
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>
