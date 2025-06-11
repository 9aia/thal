<script lang="ts" setup>
import { computed } from 'vue'
import { T, t as _t } from '@psitta/vue'

const t = ((text, values, locale) => _t(text, values, locale)) as typeof _t

const error = useError()

const errorMessage = computed(() => {
  const makeReturn = (message: string, statusCode: number) => {
    return {
      color: statusCode === 404 ? 'text-orange-500' : 'text-red-500',
      statusCode,
      message,
    }
  }

  const options: Record<number, string> = {
    403: 'You do not have permission to access this page.',
    404: 'We could not find this page.',
    410: 'This page has been removed.',
    429: 'You are making too many requests.',
    500: 'There was a problem on the server.',
    401: 'You are not logged in.',
    503: 'The server is undergoing maintenance.',
  }

  const statusCode = Object.prototype.hasOwnProperty.call(options, error.value?.statusCode || '')
    ? error.value?.statusCode
    : 500

  const message
    = error.value?.message
      || (Object.prototype.hasOwnProperty.call(options, statusCode!) ? options[statusCode!] : options[500])

  return makeReturn(message, statusCode!)
})

function handleError() {
  clearError({
    redirect: '/',
  })
}
</script>

<template>
  <NuxtLayout>
    <div class="flex flex-col w-full h-[calc(100vh - 64px)] justify-center items-center bg-white">
      <div class="mx-auto max-w-lg text-center">
        <Icon
          :name="error.statusCode === 404 ? 'material-symbols:warning-rounded' : 'material-symbols:error-rounded'"
          class="text-9xl"
          :class="[error.statusCode === 404 ? 'text-orange-500' : 'text-red-500']"
        />

        <h1 class="text-2xl mb-2">
          {{ error.statusCode === 404 ? t('Route Not Found') : t('Error') }}
        </h1>

        <p class="text-sm text-gray-500 mb-2">
          {{ error.statusCode === 404
            ? t('We couldn\'t find that page. Maybe the link is broken, or the page moved somewhere else.')
            : t('Something went wrong on our side — Thal couldn\'t load what you were expecting. It might just be a temporary glitch, or something needs fixing.') }}
        </p>

        <p class="text-sm text-gray-500">
          <T text="If the problem persists, please {reportIssue}." :values="{ reportIssue: 'true' }">
            <template #reportIssue>
              <A
                target="_blank" :localize="false" :href="t('https://forms.gle/ANMv7qnwTHva1k7L8')"
                class="text-warning underline"
              >{{ t('report the issue here') }}</A>
            </template>
          </T>
        </p>

        <A class="btn btn-primary mt-4" href="/" @click="handleError">
          {{ t('Access the home page') }}
        </A>
      </div>
    </div>
  </NuxtLayout>
</template>
