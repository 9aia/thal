<script setup lang="ts">
import { t } from '@psitta/vue'
</script>

<template>
  <div class="w-full">
    <div class="max-w-2xl mx-auto rounded-3xl">
      <div class="">
        <h2 class="text-4xl text-black flex gap-2 justify-center items-center">
          <Icon name="material-symbols:package-2-outline" class="text-black text-4xl" />
          {{ t('Subscription') }}
        </h2>

        <div class="flex gap-4 items-center justify-center flex-col sm:flex-row">
          <div class="w-full">
            <p class="text-gray-500 text-sm mb-2 mt-4 text-center sm:text-left">
              {{ t('What’s included:') }}
            </p>

            <ul class="flex flex-col mx-auto text-gray-500 space-y-1 mb-4 text-sm">
              <li class="flex justify-center gap-2">
                <Icon name="material-symbols:check" class="text-blue-500" />
                <div class="gap-2">
                  <span class="text-blue-500">{{ t('Engaging Conversations:') }}</span>
                  {{ t('Chat with AI-powered characters anytime, anywhere.') }}
                </div>
              </li>

              <li class="flex justify-center gap-2">
                <Icon name="material-symbols:check" class="text-blue-500" />
                <div class="gap-2">
                  <span class="text-blue-500">{{ t('Interactive Assistance:') }}</span>
                  {{ t('Translations, corrections, and listening while chatting.') }}
                </div>
              </li>

              <li class="flex justify-center gap-2">
                <Icon name="material-symbols:check" class="text-blue-500" />
                <div class="gap-2">
                  <span class="text-blue-500">{{ t('Personalized Characters:') }}</span>
                  {{ t('Create, discover and save characters for tailored learning.') }}
                </div>
              </li>
            </ul>
          </div>

          <div class="w-full">
            <Price />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
