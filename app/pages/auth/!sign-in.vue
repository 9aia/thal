<script setup lang="ts">
import { T, t } from '@psitta/vue'
</script>

<template>
  <div class="w-full bg-gradient-7 relative" style="height: calc(100vh - 64px)">
    <div class="absolute bottom-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
      <h1 class="card-title text-gray-800">
        {{ t('Sign in to Your Account') }}
      </h1>

      <div class="card-actions items-center justify-center">
        <form action="/api/auth/google" method="GET">
          <Button type="submit" class="bg-cyan-500 border-none mt-2 w-full flex gap-1">
            <GoogleLogo />
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

<style scoped>
.bg-gradient-7 {
  background-image: radial-gradient(at top,

      theme('colors.green.100'),
      theme('colors.white')
  );
}
</style>
