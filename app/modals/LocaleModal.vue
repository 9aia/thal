<script setup lang="ts">
import { useForm } from 'vee-validate'
import { detectLocaleFromPathname, getConfig } from '@psitta/core'
import { LOCALES } from '~/constants/base'

const { defaultLocale } = getConfig()

const { t } = useI18nExperimental()
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
  <Modal
    v-model="isOpen"
    :loading="loading"
    :confirm-text="t('Save')"
    show-close-button @confirm="submit"
  >
    <template #default>
      <h1 class="text-sm mb-4 mt-4 text-gray-900">
        {{ t("Select the interface language") }}
      </h1>

      <p class="text-sm text-gray-500 mb-4">
        {{ t("Thal allows you to tailor your preferences to suit your needs, whether you prefer to navigate in your native language or challenge yourself with English.") }}
      </p>

      <form class="h-[200px] px-2 py-4 overflow-y-auto">
        <Radio
          v-for="item in LOCALES"
          :key="item.id"
          :value="item.id"
          path="locale"
          :label="item.name"
          input-class="radio-primary"
        />
      </form>
    </template>
  </Modal>
</template>
