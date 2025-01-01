<script lang="ts" setup>
import { computed } from 'vue'
import { t as _t } from '@psitta/vue'

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
    <div
      class="flex flex-col items-center absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2"
    >
      <h1 class="text-8xl font-bold text-center mb-4" :class="errorMessage.color">
        {{ error!.statusCode }}
      </h1>
      <p class="text-center text-xl text-slate-900">
        {{ t(errorMessage.message) }}
      </p>

      <A href="/" class="mt-4 btn btn-primary text-slate-900" @click="handleError">
        {{ t('Access the home page') }}
      </A>
    </div>
  </NuxtLayout>
</template>
