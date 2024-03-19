<script setup lang="ts">
import { T, t } from '@psitta/vue'
import A from '~/src/base/components/A.vue'
import Btn from '~/src/ui/components/action/Btn.vue'
import GoogleLogo from '~/src/ui/components/display/GoogleLogo.vue'
</script>

<template>
  <div class="absolute p-4 w-full sm:p-0 sm:w-auto sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div class="card sm:w-96 bg-slate-900 text-slate-800 shadow-lg">
      <div class="card-body">
        <h1 class="card-title text-teal-500">
          {{ t('Sign in to Your Account') }}
        </h1>

        <div class="card-actions">
          <form action="/api/auth/google" method="GET">
            <Btn type="submit" class="bg-white mt-2 py-2 w-full flex gap-1">
              <GoogleLogo />
              {{ t('Sign in with Google') }}
            </Btn>
          </form>
        </div>

        <p class="mt-4 text-sm text-slate-100">
          <T
            text="By signing in, you agree to our {terms} and {privacy}."
            :values="{ terms: 'true', privacy: 'true' }"
          >
            <template #terms>
              <A href="/terms" class="link link-warning mr-1">{{ t('Terms of Service') }}</A>
            </template>
            <template #privacy>
              <A href="/privacy" class="link link-warning">{{ t('Privacy Policy') }}</A>
            </template>
          </T>
        </p>
      </div>
    </div>
  </div>
</template>
