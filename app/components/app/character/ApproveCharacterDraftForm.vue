<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { characterBuilderData, contactInfoData, isRootDrawerOpen } from '~/store'

const emit = defineEmits<{
  (e: 'approved'): void
}>()

interface FormValues {
  discoverable: boolean
}

const initialValues = ref<FormValues>({
  discoverable: characterBuilderData.value?.discoverable ?? true,
})

const { t } = useI18nExperimental()
const form = useForm<FormValues>({
  initialValues: initialValues.value,
})

watch(initialValues, () => form.setValues(initialValues.value))

const toast = useToast()
const user = useUser()
const { params } = useRoute()
const queryClient = useQueryClient()
const localWithDefaultRegion = useLocaleDefaultRegion()

// async function validateUsername(username: string) {
//   if (!username)
//     return

//   let invalid = false

//   try {
//     const { valid } = await $fetch(`/api/character/validate-username/${username}`, {
//       params: {
//         editingUsername: characterBuilderData.value?.username,
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

function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false

  navigateTo(`/app/chat/${username}`)
  toast.close()
}

const approveMutation = useMutation({
  mutationFn: (values: FormValues) => $fetch('/api/character/draft/approve', {
    method: 'POST',
    body: {
      discoverable: values.discoverable,
      characterId: characterBuilderData.value?.id,
    },
  }),
  onSuccess: (data) => {
    queryClient.resetQueries({
      queryKey: queryKeys.characterDraft,
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.myCharacters,
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.discoverCharacters,
    })
    queryClient.invalidateQueries({
      queryKey: queryKeys.contactInfo(localWithDefaultRegion.value, data.username),
    })

    // refresh chat route and contact info view if open
    const usernameQuery = params.username

    if (characterBuilderData.value?.usernames?.username === usernameQuery)
      navigateTo(`/app/chat/${data.username}`)

    if (characterBuilderData.value?.usernames?.username === contactInfoData.value?.username)
      contactInfoData.value = { ...contactInfoData.value || {}, username: data.username }

    toast.success(t('Character has been approved successfully.'), undefined, {
      actions: [
        {
          title: t('Message'),
          onClick: () => handleGoToChat(data.username),
        },
      ],
    })

    characterBuilderData.value = {
      categoryId: data.categoryId,
      usernames: {
        username: data.username,
      },
      instructions: data.instructions,
      discoverable: data.discoverable,
      id: data.id,
      creatorId: user.value!.id,
      description: data.description,
      name: data.name,
    }

    emit('approved')
  },
})

const submit = form.handleSubmit(values => approveMutation.mutate(values))

const isPastDueVisible = computed(() => {
  if (!user.value) {
    return false
  }

  return isPlanPastDue(user.value)
})
</script>

<template>
  <form class="space-y-4" @submit.prevent="submit">
    <Checkbox path="discoverable" input-class="checkbox-primary" :disabled="isPastDueVisible">
      {{
        t('Discoverable')
      }}
    </Checkbox>

    <Button
      type="submit"
      class="btn-primary"
      :loading="approveMutation.isPending.value"
      :disabled="isPastDueVisible"
    >
      {{
        t("Approve character")
      }}
    </Button>
  </form>
</template>
