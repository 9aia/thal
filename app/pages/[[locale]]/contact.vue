<script setup lang="ts">
import { T } from '@psitta/vue'

definePageMeta({
  layout: 'site',
  layoutTransition: false,
})

useAutoRedirect()

const { t } = useI18nExperimental()
</script>

<template>
  <div class="site-container">
    <div class="prose prose-slate max-w-full">
      <h1>{{ t('Contact Information') }}</h1>

      <section>
        <h2>{{ t('For Legal Issues') }}</h2>

        <p>
          <T
            text="To address any questions about this Security Policy, legal matters, or reports of violations, please email {email}."
            :values="{
              email: 'juridico@thal.9aia.com',
            }"
          >
            <template #email>
              <a href="mailto:juridico@thal.9aia.com" class="text-primary-500">juridico@thal.9aia.com</a>
            </template>
          </T>
        </p>
      </section>

      <section>
        <h2>{{ t('For Security Issues') }}</h2>

        <p>
          <T
            text="To report security vulnerabilities, please email {email} following the procedures detailed on this page."
            :values="{
              email: 'securanca@thal.9aia.com',
            }"
          >
            <template #email>
              <a href="mailto:securanca@thal.9aia.com" class="text-primary-500">securanca@thal.9aia.com</a>
            </template>
          </T>
        </p>
      </section>

      <section>
        <h2>{{ t('For Support or Any Other Communication') }}</h2>

        <p>
          <T
            text="For any other questions, technical issues, support requests, or other communications related to Thal, you can contact us via email {email}."
            :values="{
              email: 'suporte@thal.9aia.com',
            }"
          >
            <template #email>
              <a href="mailto:suporte@thal.9aia.com" class="text-primary-500">suporte@thal.9aia.com</a>
            </template>
          </T>
        </p>
      </section>

      <hr>

      <p>
        {{ t('We will strive to respond as quickly as possible, usually within 48 business hours. While we strive to respond promptly, we cannot guarantee a fixed response time.') }}
      </p>
    </div>
  </div>
</template>
