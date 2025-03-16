<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import { useDebounceFn } from '@vueuse/core'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { characterBuilderData, contactViewUsername, isRootDrawerOpen } from '~/store'

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

const initialValuesFromData = computed(() => {
  if (characterBuilderData.value) {
    return {
      prompt: characterBuilderData.value.prompt,
      discoverable: characterBuilderData.value.discoverable,
    }
  }

  return {
    prompt: '',
    discoverable: false,
  }
})

const form = useForm<FormValues>({
  initialValues: initialValuesFromData.value,
})

watch(characterBuilderData, () => {
  characterBuilderData.value
    ? form.setValues(initialValuesFromData.value)
    : form.resetForm()
})

const user = useUser()

const hasErrors = useHasFormErrors(form)
const loading = ref(false)
const queryClient = useQueryClient()
const { params } = useRoute()

// async function validateUsername(username: string) {
//   if (!username)
//     return

//   let invalid = false

//   try {
//     const { valid } = await $fetch(`/api/character/validate-username/${username}`, {
//       params: {
//         allowedUsername: characterBuilderData.value?.username,
//       },
//     })

//     invalid = !valid
//   }
//   catch (e) {
//     const _ = e

//     toast.error(t(
//       'An error occurred while validating username.',
//     ))
//     invalid = false
//   }

//   form.setFieldError(
//     'username',
//     invalid ? t('Username is invalid.') : undefined,
//   )
// }

// const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
// watch(() => form.values.username, debouncedValidateUsername)

const isEditing = computed(() => characterBuilderData.value?.id)

const submit = form.handleSubmit(async (data) => {
  loading.value = true

  try {
    if (isEditing.value) {
      const response = await $fetch(`/api/character/${characterBuilderData.value?.username}` as '/api/character/:username', {
        method: 'PATCH',
        body: data,
      })

      toast.success(t('Character has been edited successfully.'), undefined, {
        actions: [
          {
            title: t('Message'),
            onClick: () => navigateTo(`/app/chat/${response.username}`),
          },
        ],
      })

      const usernameQuery = params.username

      if (characterBuilderData.value?.username === usernameQuery)
        navigateTo(`/app/chat/${response.username}`)

      if (characterBuilderData.value?.username === contactViewUsername.value)
        contactViewUsername.value = response.username

      queryClient.invalidateQueries({
        queryKey: queryKeys.contactInfo(characterBuilderData.value!.username),
      })
    }
    else {
      const response = await $fetch(`/api/character/index-new`, {
        method: 'post',
        body: {
          ...data,
        },
      })

      toast.success(t('Character has been created successfully.'), undefined, {
        actions: [
          {
            title: t('Message'),
            onClick: () => {
              isRootDrawerOpen.value = false
              navigateTo(`/app/chat/${response.username}`)
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
      <SettingSection>
        <form class="block space-y-2" @submit="submit">
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
              t("Generate")
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
