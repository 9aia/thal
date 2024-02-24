<script setup lang="ts">
import type Data from './+data'
import Btn from '#lib/daisy/components/action/Btn.vue'
import GoogleLogo from '#lib/daisy/components/display/GoogleLogo.vue'
import { useData } from '#lib/vike/composables/useData'
import { T, t } from '#lib/i18n'
import A from '#lib/vike/components/A.vue'

const data = useData<typeof Data>()
</script>

<template>
  <div class="absolute p-4 w-full sm:p-0 sm:w-auto sm:h-auto top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <div class="card sm:w-96 bg-white text-primary-content shadow-lg">
      <div class="card-body">
        <h1 class="card-title">
          {{ t("Sign in to Your Account") }}
        </h1>

        <div class="card-actions">
          <form action="/api/auth/google" method="GET">
            <input v-if="data.type" type="hidden" name="type" value="pricing">

            <Btn type="submit" class="mt-2 py-2 w-full flex gap-1">
              <GoogleLogo />
              Sign in with Google
            </Btn>
          </form>
        </div>

        <p class="mt-4 text-sm text-gray-600">
          <T
            text="By signing in, you agree to our {terms} and {privacy}."
            :values="{ terms: 'true', privacy: 'true' }"
          >
            <template #terms>
              <A href="/terms" class="link link-warning mr-1">{{ t("Terms of Service") }}</A>
            </template>
            <template #privacy>
              <A href="/privacy" class="link link-warning">{{ t("Privacy Policy") }}</A>
            </template>
          </T>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.radial {
  background: linear-gradient(#14b8a6, transparent),
  linear-gradient( #14b8a6, transparent);
}
.radial-2 {
  background: radial-gradient(ellipse at bottom, #14b8a6, transparent),
            radial-gradient(ellipse at left, #f97316, transparent);
}
</style>
