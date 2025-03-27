<script setup lang="ts">
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import queryKeys from '~/queryKeys'
import { characterBuilderData } from '~/store'

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
}

const draftQuery = useQuery({
  queryKey: queryKeys.characterDraftEdit(characterBuilderData.value?.username as string),
  queryFn: () => $fetch('/api/character/draft', {
    query: {
      characterId: characterBuilderData.value?.id,
    },
  }),
})

const initialValuesFromData = computed(() => {
  if (characterBuilderData.value) {
    return {
      prompt: characterBuilderData.value.prompt,
    }
  }

  return {
    prompt: draftQuery.data.value?.prompt || '',
  }
})

const form = useForm<FormValues>({
  initialValues: initialValuesFromData.value,
})

watch(draftQuery.data, () => {
  if (draftQuery.data.value) {
    form.setValues({
      prompt: draftQuery.data.value.prompt,
    })
  }
})

onMounted(() => {
  if (draftQuery.data.value) {
    form.setValues({
      prompt: draftQuery.data.value.prompt,
    })
  }
})

const user = useUser()

const hasErrors = useHasFormErrors(form)
const loading = ref(false)
const queryClient = useQueryClient()

const createCharacterDraft = useMutation({
  mutationFn: async (data: FormValues) => {
    return await $fetch('/api/character/draft', {
      method: 'post',
      body: data,
    })
  },
})

const updateCharacterDraft = useMutation({
  mutationFn: async (data: FormValues) => {
    return await $fetch('/api/character/draft', {
      method: 'patch',
      body: data,
    })
  },
})

const editApprovedCharacterDraft = useMutation({
  mutationFn: async (data: FormValues) => {
    return await $fetch(`/api/character/draft/${characterBuilderData.value!.username as string}`, {
      method: 'patch',
      body: data,
    })
  },
})

const isError = computed(() => {
  return createCharacterDraft.isError || updateCharacterDraft.isError || editApprovedCharacterDraft.isError
})

const isEditing = computed(() => !!characterBuilderData.value?.id)

const submit = form.handleSubmit(async (data) => {
  loading.value = true

  try {
    if (isEditing.value) {
      await editApprovedCharacterDraft.mutateAsync(data)
    }
    else {
      if (draftQuery.data.value) {
        await updateCharacterDraft.mutateAsync(data)
      }
      else {
        await createCharacterDraft.mutateAsync(data)
      }
    }

    queryClient.invalidateQueries({
      queryKey: queryKeys.characterDraft,
    })
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

const draft = computed(() => draftQuery.data.value)

const trunkedInstructions = computed(() => {
  if (!draft.value) {
    return ''
  }

  return draft.value.instructions.split('\n').slice(0, 3).join('\n')
})
const showMore = ref(false)
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar :title="t('Build Character')" @close="emit('close')" />

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
        <form class="block space-y-4" @submit="submit">
          <Textarea
            ref="mainField"
            path="prompt"
            :label="t('Describe your character')"
            :disabled="isPastDueVisible"
          />

          <Button :loading="loading" class="btn-info" :disabled="hasErrors || isPastDueVisible">
            {{
              t("Generate")
            }}
          </Button>
        </form>
      </SettingSection>

      <Resource
        :loading="loading"
        :error="isError.value"
      >
        <template #default>
          <SettingSection v-if="draft">
            <div
              class="bg-gradient-2 rounded-2xl p-4 mb-2"
            >
              <h1 class="text-sm p-0">
                {{ t('Preview') }}
              </h1>

              <div class="space-y-2 flex flex-col items-end">
                <section class="w-full px-4 pb-2 flex flex-col justify-center">
                  <Avatar :name="draft.name" class="mx-auto w-16 h-16 text-base bg-gray-300 text-gray-800 mt-2" />

                  <h2 class="text-gray-900 text-center text-base mt-2">
                    {{ draft.name }}
                  </h2>

                  <Username :username="draft.username" class="mx-auto text-xs" />
                </section>

                <section class="w-full flex flex-col gap-2 pb-4">
                  <MenuItem
                    :is="{
                      id: 'description',
                      name: draft.description,
                      icon: 'person',
                    }"
                  />

                  <MenuItem
                    :is="{
                      id: 'category',
                      name: draft.categoryName,
                      icon: 'category',
                    }"
                  />

                  <div class="h-px bg-gray-100 my-1" />

                  <MenuItem
                    :is="{
                      id: 'instructions',
                      name: t('Instructions'),
                      icon: 'integration_instructions',
                    }"
                  />

                  <div class="flex flex-col gap-1">
                    <MDC tag="article" class="prose prose-sm" :value="showMore ? draft.instructions : trunkedInstructions" />

                    <div role="button" class="text-blue-500 hover:underline text-sm text-left" @click="showMore = !showMore">
                      {{ showMore ? t('Show less') : t('Show more') }}
                    </div>
                  </div>
                </section>
              </div>
            </div>

            <ApproveCharacterDraftForm />
          </SettingSection>
        </template>
      </Resource>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-2 {
  background: radial-gradient(at bottom, theme('colors.blue.50'), theme('colors.white'));
}
</style>
