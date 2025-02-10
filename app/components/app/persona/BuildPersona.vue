<script setup lang="ts">
import { useI18n } from '@psitta/vue'
import { useQueryClient } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { descriptionSchema, instructionsSchema, nameSchema, usernameSchema } from '~~/db/schema'
import { contactViewUsername, isRootDrawerOpen, personaBuilderData } from '~/store'
import type { Persona } from '~/types'
import queryKeys from '~/queryKeys'

const emit = defineEmits<{
  (e: 'close'): void
}>()
const { t } = useI18n()
const toast = useToast()

const form = useForm<Persona>({
  initialValues: personaBuilderData.value,
})

watch(personaBuilderData, () => {
  if (personaBuilderData.value)
    form.setValues(personaBuilderData.value)
  else
    form.resetForm()
})

const hasErrors = useHasFormErrors(form)
const loading = ref(false)
const queryClient = useQueryClient()
const { params } = useRoute()

async function validateUsername(username: string) {
  if (!username)
    return

  let invalid = false

  try {
    const { valid } = await $fetch(`/api/persona/validate-username/${username}`, {
      params: {
        allowedUsername: personaBuilderData.value?.username,
      },
    })

    invalid = !valid
  }
  catch (e) {
    const _ = e

    toast.error(t(
      'An error occurred while validating username.',
    ))
    invalid = false
  }

  form.setFieldError(
    'username',
    invalid ? t('Username is invalid.') : undefined,
  )
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

const isEditing = computed(() => personaBuilderData.value?.id)

const submit = form.handleSubmit(async (data) => {
  loading.value = true

  try {
    if (isEditing.value) {
      await $fetch(`/api/persona/${personaBuilderData.value?.username}` as '/api/persona/:username', {
        method: 'PATCH',
        body: {
          ...data,
          conversationStarters: [],
        },
      })

      toast.success(t('Character has been edited successfully.'), undefined, {
        actions: [
          {
            title: t('Message'),
            onClick: () => navigateTo(`/app/chat/${data.username}`),
          },
        ],
      })

      const usernameQuery = params.username

      if (personaBuilderData.value?.username === usernameQuery)
        navigateTo(`/app/chat/${data.username}`)

      if (personaBuilderData.value?.username === contactViewUsername.value)
        contactViewUsername.value = data.username

      queryClient.invalidateQueries({
        queryKey: queryKeys.contactInfo(personaBuilderData.value!.username),
      })
    }
    else {
      await $fetch(`/api/persona`, {
        method: 'post',
        body: {
          ...data,
          conversationStarters: [],
        },
      })

      toast.success(t('Character has been created successfully.'), undefined, {
        actions: [
          {
            title: t('Message'),
            onClick: () => {
              isRootDrawerOpen.value = false
              navigateTo(`/app/chat/${data.username}`)
            },
          },
        ],
      })
    }

    queryClient.invalidateQueries({
      queryKey: queryKeys.myPersonas,
    })

    queryClient.invalidateQueries({
      queryKey: queryKeys.discoverPersonas,
    })

    emit('close')

    form.resetForm()
  }
  catch (e) {
    const _ = e
    toast.error(t('An error occurred while creating character.'))
  }

  loading.value = false
})

const { mainField } = useBuildPersonaFocus()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-gradient-1 flex items-center gap-1">
        <Button size="sm" class="btn-ghost" shape="circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Button>
        {{ t("Build Character") }}
      </h1>
    </Navbar>

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <SettingSection :title="t('General Information')">
        <form class="block space-y-2" @submit="submit">
          <TextField
            ref="mainField"
            path="name"
            :label="t('Name')"
            :rules="yupify(nameSchema, t(
              'Name must contain between 1 and 20 characters.',
            ))"
          />
          <TextField
            path="username"
            autocapitalize="none"
            autocomplete="off"
            :label="t('Username')"
            :rules="yupify(usernameSchema, t('Username is invalid.'))"
            icon-position="right"
          >
            <template #icon="{ errorMessage }">
              <Icon
                :class="{ 'text-error': errorMessage, 'text-success': !errorMessage }"
                :name="errorMessage ? 'close' : 'check'"
              />
            </template>
          </TextField>

          <TextField
            path="description" :label="t('Description')" :rules="yupify(descriptionSchema, t(
              'Description must contain between 1 and 100 characters.',
            ))"
          />

          <Textarea
            path="instructions" :label="t('Instructions')" :rules="yupify(instructionsSchema, t(
              'Instructions must contain between 1 and 500 characters.',
            ))"
          />

          <Checkbox path="discoverable" input-class="checkbox-primary">
            {{
              t('Discoverable')
            }}
          </Checkbox>

          <div class="h-2" />

          <Button :loading="loading" class="btn-primary" :disabled="hasErrors">
            {{
              t("Save")
            }}
          </Button>
        </form>
      </SettingSection>
    </div>
  </div>
</template>

<style scoped>
.text-gradient-1 {
  background: radial-gradient(theme('colors.blue.500'), theme('colors.cyan.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
