<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { characterBuilderData, contactViewUsername } from '~/store'

const emit = defineEmits<{
  (e: 'approved'): void
}>()

interface FormValues {
  discoverable: boolean
}

const { t } = useI18nExperimental()
const form = useForm<FormValues>({
  initialValues: {
    discoverable: true,
  },
})

const toast = useToast()
const user = useUser()
const { params } = useRoute()
const queryClient = useQueryClient()

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
      queryKey: queryKeys.contactInfo(data.username),
    })

    const usernameQuery = params.username

    if (characterBuilderData.value?.username === usernameQuery)
      navigateTo(`/app/chat/${data.username}`)

    if (characterBuilderData.value?.username === contactViewUsername.value)
      contactViewUsername.value = data.username

    toast.success(t('Character has been approved successfully.'), undefined, {
      actions: [
        {
          title: t('Message'),
          onClick: () => navigateTo(`/app/chat/${data.username}`),
        },
      ],
    })

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
