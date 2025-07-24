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
    await navigateTo(urlWithoutLocale, { replace: true })
  else
    await navigateTo(`/${locale}${urlWithoutLocale}`, { replace: true })

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
    :confirm-loading="loading"
    :confirm-text="t('Save interface language')"
    confirm-icon="material-symbols:save-outline-rounded"
    show-close-button :title="t('Select the Interface Language')"
    no-scroll
    @confirm="submit"
  >
    <template #header>
      <p class="mb-4 text-sm text-gray-500">
        {{ t("Thal allows you to tailor your preferences to suit your needs, whether you prefer to navigate in your native language or challenge yourself with English.") }}
      </p>
    </template>

    <template #default>
      <form class="px-8">
        <RadioField
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
