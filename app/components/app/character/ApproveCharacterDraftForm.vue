<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import type { FetchError } from 'ofetch'
import queryKeys from '~/queryKeys'
import { characterBuilderData, contactInfoData, isRootDrawerOpen } from '~/store'
import { CONFLICT_STATUS_CODE } from '~/utils/web'

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

    emit('approved')
  },
  onError: (error) => {
    const e = error as FetchError

    if (e.statusCode === CONFLICT_STATUS_CODE) {
      toast.error(t('That username\'s taken — tweak your prompt or suggest one directly.'))
      return
    }

    toast.error(t('An error occurred while approving character.'))
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
