<script setup lang="ts">
import Modal from '#lib/daisy/components/action/Modal.vue'
import Radio from '#lib/daisy/components/data-input/Radio.vue'
import Icon from '#lib/daisy/components/display/Icon.vue'
import { useToast } from '#lib/daisy/composables/useToast'
import { useI18n } from '#lib/i18n'
import { getConfig } from '#lib/i18n/utils'
import { Cookies } from '#lib/web/utils/cookies'
import { useForm } from 'vee-validate'
import { navigate } from 'vike/client/router'
import { onMounted, ref } from 'vue'
import { LOCALES } from '../../profile/constants'

const { t } = useI18n()
const toast = useToast()
const i18nConfig = getConfig()

const form = useForm<Record<string, string>>()

onMounted(() => {
  form.setFieldValue('locale', Cookies.get('locale') || i18nConfig.defaultLocale)
})

const isOpen = defineModel({ default: false })
const loading = ref(false)

const submit = form.handleSubmit(async (data) => {
  const locale = data.locale

  Cookies.set('locale', locale, { path: '/' })

  loading.value = true

  if (locale === i18nConfig.defaultLocale)
    await navigate(`/app/settings`)
  else
    await navigate(`/${locale}/app/settings`)

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
    @confirm="submit"
  >
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("Select the interface language") }}
      </h1>

      <p class="font-gray-600 mb-4">
        {{
          t(
            "Maratongue allows you to tailor your preferences to suit your needs, whether you prefer to navigate in your native language or challenge yourself with English.",
          )
        }}
      </p>

      <div class="h-[200px] px-2 overflow-auto">
        <Radio
          v-for="item in LOCALES"
          :key="item.id"
          path="locale"
          :value="item.id"
          :label="item.name"
        >
          <Icon>{{ item.icon }}</Icon>
          {{ item.name }}
        </Radio>
      </div>

      <p class="text-sm text-gray-600">
        {{ t('P.S. Choosing your native language for the interface will not impact the lessons themselves.') }}
      </p>
    </template>
  </Modal>
</template>
