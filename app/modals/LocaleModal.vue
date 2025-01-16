<script setup lang="ts">
import { useForm } from 'vee-validate'
import { detectLocaleFromPathname, getConfig } from '@psitta/core'
import { useI18n } from '@psitta/vue'
import { LOCALES } from '~/constants/base'

const { defaultLocale } = getConfig()

const { t } = useI18n()
const toast = useToast()

const form = useForm<Record<string, string>>()

onMounted(() => {
  const localeCookie = useCookie('locale', { path: '/' })
  form.setFieldValue('locale', localeCookie.value || defaultLocale)
})

const isOpen = defineModel({ default: false })
const loading = ref(false)

const route = useRoute()

const { urlWithoutLocale } = detectLocaleFromPathname(route.path)

const submit = form.handleSubmit(async (data) => {
  const locale = data.locale

  const localeCookie = useCookie('locale', { path: '/' })
  localeCookie.value = locale

  loading.value = true

  const scrollX = window.scrollX
  const scrollY = window.scrollY

  if (locale === defaultLocale)
    await navigateTo(urlWithoutLocale)
  else
    await navigateTo(`/${locale}${urlWithoutLocale}`)

  requestAnimationFrame(() => {
    setTimeout(() => {
      window.scrollTo(scrollX, scrollY)
    }, 0)
  })

  toast.success(t('The language has been updated successfully.'))

  isOpen.value = false
  loading.value = false
})
</script>

<template>
  <Modal v-model="isOpen" :loading="loading" :confirm-text="t('Save')" @confirm="submit">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4 text-gray-900">
        {{ t("Select the interface language") }}
      </h1>

      <p class="font-gray-600 mb-4">
        {{ t("Thal allows you to tailor your preferences to suit your needs, whether you prefer to navigate in your native language or challenge yourself with English.") }}
      </p>

      <div class="h-[200px] px-2 overflow-auto">
        <Radio v-for="item in LOCALES" :key="item.id" path="locale" :value="item.id" :label="item.name">
          <Icon>{{ item.icon }}</Icon>
          {{ item.name }}
        </Radio>
      </div>
    </template>
  </Modal>
</template>
