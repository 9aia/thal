<script setup lang="ts">
import { T, t } from '@psitta/vue'

definePageMeta({
  layout: 'site',
})
</script>

<template>
  <div class="w-full relative" style="height: calc(100vh - 64px)">
    <div class="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2 w-full text-center p-4">
      <h1 class="text-3xl text-black text-center mb-4">
        {{ t('Sign in to Your Account') }}
      </h1>

      <div class="flex items-center justify-center">
        <form action="/api/auth/google" method="GET">
          <Button
            type="submit"
            class="btn btn-neutral mt-2"

            icon="logos:google-icon"
          >
            {{ t('Continue with Google') }}
          </Button>
        </form>
      </div>

      <p class="mt-4 text-sm text-black">
        <T text="By signing in, you agree to our {terms} and {privacy}." :values="{ terms: 'true', privacy: 'true' }">
          <template #terms>
            <A href="/terms" class="link text-brown-500 mr-1">{{ t('Terms of Service') }}</A>
          </template>
          <template #privacy>
            <A href="/privacy" class="link text-brown-500">{{ t('Privacy Policy') }}</A>
          </template>
        </T>
      </p>
    </div>
  </div>
</template>
