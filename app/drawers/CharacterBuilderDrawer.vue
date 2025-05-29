<script setup lang="ts">
import { Menu } from '@ark-ui/vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import type { FetchError } from 'ofetch'
import { T } from '@psitta/vue'
import type { MenuItemType } from '~/components/ui/navigation/types'
import queryKeys from '~/queryKeys'
import { characterBuildId, characterBuildPrompt } from '~/store'
import type { CharacterBuildApiData, CharacterBuilderEditViewMode } from '~/types'

const emit = defineEmits<{
  (e: 'close'): void
}>()
const { t } = useI18nExperimental()
const localWithDefaultRegion = useLocaleDefaultRegion()
const toast = useToast()

useAutoRedirect({
  query: { drawer: ['create'] },
})

interface FormValues {
  prompt: string
}

function fetchBuild() {
  return new Promise<CharacterBuildApiData | null>((resolve, reject) => {
    $fetch('/api/character/build', {
      query: {
        characterId: characterBuildId.value,
        locale: localWithDefaultRegion.value,
      },
      async onResponse({ response }) {
        if (response.status === 204) {
          resolve(null)
        }

        if (response.status === 200) {
          resolve(response._data)
        }

        reject(new Error('Failed to fetch character draft'))
      },
      onResponseError() {
        reject(new Error('Failed to fetch character draft'))
      },
    })
  })
}

const buildQuery = useQuery({
  queryKey: queryKeys.characterDraftEdit(localWithDefaultRegion, characterBuildId),
  queryFn: fetchBuild,
})

const initialValuesFromData = computed(() => {
  return {
    prompt: buildQuery.data.value?.draft.prompt || characterBuildPrompt.value || '',
  }
})

const form = useForm<FormValues>({
  initialValues: initialValuesFromData.value,
})

watch(buildQuery.data, () => {
  if (buildQuery.data.value) {
    form.setValues({
      prompt: buildQuery.data.value.draft.prompt,
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
      body: {
        ...data,
        locale: localWithDefaultRegion.value,
      },
    })
  },
})

const updateCharacterDraft = useMutation({
  mutationFn: async (variables: { data: FormValues, characterId?: number }) => {
    return await $fetch('/api/character/draft', {
      method: 'patch',
      body: {
        ...variables.data,
        characterId: variables.characterId,
        locale: localWithDefaultRegion.value,
      },
    })
  },
})

const isError = computed(() => {
  return createCharacterDraft.isError || updateCharacterDraft.isError
})

const isEditing = computed(() => !!characterBuildId.value)

const submit = form.handleSubmit(async (data) => {
  loading.value = true

  try {
    if (isEditing.value) {
      await updateCharacterDraft.mutateAsync({ data, characterId: characterBuildId.value! })
    }
    else if (buildQuery.data.value) {
      await updateCharacterDraft.mutateAsync({ data })
    }
    else {
      await createCharacterDraft.mutateAsync(data)
    }

    queryClient.invalidateQueries({
      queryKey: queryKeys.characterDraft(localWithDefaultRegion),
    })
  }
  catch (_) {
    const e = _ as FetchError

    if (e.statusCode === INTERNAL_STATUS_CODE && e.statusMessage?.startsWith?.('Generated data is invalid:')) {
      toast.error(t('Generated data is invalid. Please try regenerating again.'))
    }
    else if (e.statusCode === RATE_LIMIT_STATUS_CODE) {
      toast.error(t('You are generating characters too fast. Please wait a moment.'))
    }
    else {
      toast.error(t('Something went wrong generating character. Try again.'))
    }
  }

  loading.value = false
})

const isPastDueVisible = computed(() => {
  if (!user.value) {
    return false
  }

  return isPlanPastDue(user.value)
})

const viewMode = ref<CharacterBuilderEditViewMode>('preview')

const items: MenuItemType[] = [
  { id: 'preview', name: t('Preview'), icon: 'material-symbols:preview-outline', description: t('How it will look after approval'), onClick: () => viewMode.value = 'preview' },
  { id: 'original', name: t('Original'), icon: 'material-symbols:history-edu-outline', description: t('How it looked before editing'), onClick: () => viewMode.value = 'original' },
]

const hasChanges = computed(() => {
  const d = buildQuery.data.value?.draft
  const c = buildQuery.data.value?.character

  if (!d || !c) {
    return false
  }

  return !(d.username === c.username
    && d.description === c.description
    && d.instructions === c.instructions
    && d.name === c.name
    && d.categoryName === c.categoryName)
})
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar :title="isEditing ? t('Edit Character') : t('Create Character')" @close="emit('close')" />

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
              <Icon name="material-symbols:subscriptions-outline" />
              <span class="whitespace-nowrap">{{ t("Renew Thal") }}</span>
            </span>
          </Button>
        </form>
      </div>
    </AppNote>

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <template v-if="isEditing">
        <div class="px-1 text-sm text-gray-400">
          <T
            text="You are editing {name}."
            :values="{ name: true }"
          >
            <template #name>
              <button class="text-blue-500" @click="navigateTo(`/app/chat/${buildQuery.data.value?.character!.username}`)">
                {{ buildQuery.data.value?.character!.name }}
              </button>
            </template>
          </T>
        </div>
      </template>

      <SettingSection>
        <form class="block space-y-4" @submit="submit">
          <Textarea
            autofocus
            path="prompt"
            :label="t('Describe your character')"
            :disabled="isPastDueVisible"
          />

          <Button :loading="loading" class="btn-info text-white" :disabled="!form.values.prompt || hasErrors || isPastDueVisible">
            {{ !!buildQuery.data.value ? t("Regenerate") : t("Generate") }}
          </Button>
        </form>
      </SettingSection>

      <Resource
        :loading="loading"
        :error="isError.value"
      >
        <template #default>
          <SettingSection v-if="buildQuery.data.value">
            <div
              class="bg-gradient-2 rounded-2xl p-4 mb-2"
            >
              <div v-if="hasChanges" class="text-sm p-0 flex gap-1 justify-end relative hover:cursor-pointer">
                <Menu.Root>
                  <Menu.Trigger class="absolute z-10 -right-2 top-0 btn btn-sm h-fit rounded-full pr-2 pl-3 py-1 bg-transparent border-none shadow-none flex items-center justify-center" @click.stop.prevent>
                    {{ viewMode === "preview" ? t('Preview') : t('Original') }}

                    <Icon class="rotate-180 text-base" name="material-symbols:keyboard-arrow-up" />
                  </Menu.Trigger>

                  <Menu.Positioner>
                    <Menu.Content class="focus:outline-none shadow-sm bg-base-100 rounded-box w-64 z-40 p-2">
                      <Menu.Item v-for="item in items" :id="item.id" :key="item.id" :value="item.id" class="py-2 px-3 hover:bg-base-200 rounded-lg" @click.stop.prevent="item.onClick">
                        <MenuItem :is="item" />
                      </Menu.Item>
                    </Menu.Content>
                  </Menu.Positioner>
                </Menu.Root>
              </div>

              <CharacterShowcase v-if="viewMode === 'preview'" :data="buildQuery.data.value.draft" />
              <CharacterShowcase v-if="viewMode === 'original'" :data="buildQuery.data.value.character!" />
            </div>

            <ApproveCharacterDraftForm
              :should-show-discard="hasChanges || !isEditing"
              :is-editing="isEditing"
              :username="buildQuery.data.value.draft.username"
              :discoverable="buildQuery.data.value.character?.discoverable"
            />
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
