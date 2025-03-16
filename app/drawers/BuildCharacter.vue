<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { descriptionSchema, instructionsSchema, nameSchema, usernameSchema } from '~~/db/schema'
import { characterBuilderData, contactViewUsername, isRootDrawerOpen } from '~/store'
import type { Character } from '~/types'
import queryKeys from '~/queryKeys'

const emit = defineEmits<{
  (e: 'close'): void
}>()
const { t } = useI18nExperimental()
const toast = useToast()

useAutoRedirect({
  query: { drawer: ['create'] },
})

interface FormValues {
  prompt: string
  discoverable: boolean
}

const form = useForm<FormValues>({
  initialValues: characterBuilderData.value,
})

watch(characterBuilderData, () => {
  if (characterBuilderData.value)
    form.setValues(characterBuilderData.value)
  else
    form.resetForm()
})

const user = useUser()

const hasErrors = useHasFormErrors(form)
const loading = ref(false)
const queryClient = useQueryClient()
const { params } = useRoute()

async function validateUsername(username: string) {
  if (!username)
    return

  let invalid = false

  try {
    const { valid } = await $fetch(`/api/character/validate-username/${username}`, {
      params: {
        allowedUsername: characterBuilderData.value?.username,
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

const isEditing = computed(() => characterBuilderData.value?.id)

const submit = form.handleSubmit(async (data) => {
  loading.value = true

  try {
    if (isEditing.value) {
      await $fetch(`/api/character/${characterBuilderData.value?.username}` as '/api/character/:username', {
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

      if (characterBuilderData.value?.username === usernameQuery)
        navigateTo(`/app/chat/${data.username}`)

      if (characterBuilderData.value?.username === contactViewUsername.value)
        contactViewUsername.value = data.username

      queryClient.invalidateQueries({
        queryKey: queryKeys.contactInfo(characterBuilderData.value!.username),
      })
    }
    else {
      await $fetch(`/api/character`, {
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
      queryKey: queryKeys.myCharacters,
    })

    queryClient.invalidateQueries({
      queryKey: queryKeys.discoverCharacters,
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

const isPastDueVisible = computed(() => {
  if (!user.value) {
    return false
  }

  return isPlanPastDue(user.value)
})

const { mainField } = useBuildCharacterFocus()
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

    <AppNote
      :model-value="isPastDueVisible"
      hide-close
    >
      <div class="flex justify-between items-center gap-2 w-full">
        <h2 class="text-sm text-black">
          <div v-if="isEditing">
            {{ t("Renew your overdue subscription to edit characters.") }}
          </div>

          <div v-else>
            {{ t("Renew your overdue subscription to create new characters.") }}
          </div>
        </h2>

        <form action="/api/payment/stripe/create-portal-session" method="POST">
          <Button size="xs" class="bg-yellow-500 rounded-full">
            <span class="flex text-black items-center justify-center gap-1">
              <Icon name="subscriptions" />
              <span class="whitespace-nowrap">{{ t("Renew Thal") }}</span>
            </span>
          </Button>
        </form>
      </div>
    </AppNote>

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <SettingSection :title="t('General Information')">
        <form class="block space-y-2" @submit="submit">
          <!-- <TextField
            ref="mainField"
            path="name"
            :label="t('Name')"
            :rules="yupify(nameSchema, t(
              'Name must contain between 1 and 20 characters.',
            ))"
            :disabled="isPastDueVisible"
          />
          <TextField
            path="username"
            autocapitalize="none"
            autocomplete="off"
            :label="t('Username')"
            :rules="yupify(usernameSchema, t('Username is invalid.'))"
            icon-position="right"
            :disabled="isPastDueVisible"
          >
            <template #icon="{ errorMessage }">
              <Icon
                :class="{ 'text-red-500': errorMessage, 'text-green-500': !errorMessage }"
                :name="errorMessage ? 'close' : 'check'"
              />
            </template>
          </TextField>

          <TextField
            path="description" :label="t('Description')" :rules="yupify(descriptionSchema, t(
              'Description must contain between 1 and 100 characters.',
            ))"
            :disabled="isPastDueVisible"
          />

          <Textarea
            path="instructions" :label="t('Instructions')" :rules="yupify(instructionsSchema, t(
              'Instructions must contain between 1 and 500 characters.',
            ))"
            :disabled="isPastDueVisible"
          />

          <div class="h-2" /> -->

          <Textarea
            path="prompt"
            :label="t('Describe your character')"
            :disabled="isPastDueVisible"
          />

          <Checkbox path="discoverable" input-class="checkbox-primary" :disabled="isPastDueVisible">
            {{
              t('Discoverable')
            }}
          </Checkbox>

          <div class="h-2" />

          <Button :loading="loading" class="btn-primary" :disabled="hasErrors || isPastDueVisible">
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
