<script setup lang="ts">
import { T } from '@psitta/vue'

withDefaults(defineProps<{
  error: number
}>(), {
  error: 404,
})

const emit = defineEmits<{
  (e: 'handleError'): void
}>()

const { t } = useI18nExperimental()
</script>

<template>
  <div class="mx-auto max-w-lg text-center">
    <Icon
      :name="error === 404 ? 'material-symbols:warning-rounded' : 'material-symbols:error-rounded'"
      class="text-9xl"
      :class="[error === 404 ? 'text-orange-500' : 'text-red-500']"
    />

    <h1 class="text-black text-3xl">
      {{ error === 404 ? t('Route Not Found') : t('Something Went Wrong') }}
    </h1>

    <template v-if="error === 404">
      <p class="text-xl text-gray-500 mt-6">
        {{ t('Hmm... we couldn\'t find that route. It might have been moved, renamed, or never existed at all. Please check the URL for typos.') }}
      </p>

      <A href="/" class="btn btn-primary mt-6" @click="emit('handleError')">
        {{ t('Go to the home page') }}
      </A>

      <p class="text-xs text-gray-500 mt-6">
        <T text="If you think this is a mistake, {reportIssue}  We’ll take a look and get it fixed." :values="{ reportIssue: 'true' }">
          <template #reportIssue>
            <A
              target="_blank"
              :localize="false"
              href="https://forms.gle/UyGBzPrBeNfFgwLD6"
              class="text-warning underline"
            >
              {{ t('let us know here.') }}
            </A>
          </template>
        </T>
      </p>
    </template>

    <template v-else>
      <p class="text-xl text-gray-500 mt-6">
        {{ t('Uh-oh... something went wrong on our end. It might be a temporary glitch, or the server’s just having a rough day. Please try again later.') }}
      </p>

      <A href="/" class="btn btn-primary mt-6" @click="emit('handleError')">
        {{ t('Go to the home page') }}
      </A>

      <p class="text-xs text-gray-500 mt-6">
        <T text="If the problem persists, {reportIssue}. We’ll check it out and get things back on track." :values="{ reportIssue: 'true' }">
          <template #reportIssue>
            <A
              target="_blank"
              :localize="false"
              href="https://forms.gle/UyGBzPrBeNfFgwLD6"
              class="text-warning underline"
            >
              {{ t('let us know here') }}
            </A>
          </template>
        </T>
      </p>
    </template>
  </div>
</template>
