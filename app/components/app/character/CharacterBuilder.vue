<script setup lang="ts">
import { Menu } from '@ark-ui/vue'
import { T } from '@psitta/vue'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { FetchError } from 'ofetch'
import { useForm } from 'vee-validate'
import type { MenuItemType } from '~/components/ui/navigation/types'
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import queryKeys from '~/queryKeys'
import { characterBuildId, characterBuildPrompt } from '~/store'
import type { CharacterBuildApiData, CharacterBuilderEditViewMode } from '~/types'
import { SubscriptionStatus, promptSchema, promptSchemaChecks } from '~~/db/schema'

const props = defineProps<{
  characterUsername?: string
}>()

const emit = defineEmits<{
  (e: 'back'): void
}>()

const { t } = useI18nExperimental()
const localWithDefaultRegion = useLocaleWithDefaultRegion()
const toast = useToast()

interface FormValues {
  prompt: string
}

const headers = useRequestHeaders(['cookie'])
function fetchBuild() {
  return new Promise<CharacterBuildApiData | null>((resolve, reject) => {
    $fetch('/api/character/build', {
      query: {
        characterId: characterBuildId.value,
        characterUsername: props.characterUsername, // Fallback to username if characterId is not available
        locale: localWithDefaultRegion.value,
      },
      headers,
      async onResponse({ response }) {
        if (response.status === 204) {
          resolve(null)
        }

        if (response.status === 402) {
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
  queryFn: () => fetchBuild(),
})

await buildQuery.suspense()

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

const hasFormErrors = useHasFormErrors(form)
const loading = ref(false)
const queryClient = useQueryClient()
const toastPaymentRequiredOptions = useToastPaymentRequiredOptions()

const createCharacterDraft = useMutation({
  mutationFn: async (data: FormValues) => {
    return await $fetch('/api/character/draft', {
      method: 'post',
      body: {
        ...data,
        locale: localWithDefaultRegion.value,
      },
      onResponse({ response }) {
        if (response.status === 402) {
          throw toast.error(
            t('Trial or payment required for this feature.'),
            undefined,
            toastPaymentRequiredOptions(),
          )
        }
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
        characterId: variables.characterId ?? undefined,
        characterUsername: props.characterUsername, // Fallback to username if characterId is not available
        locale: localWithDefaultRegion.value,
      },
      onResponse({ response }) {
        if (response.status === 402) {
          throw toast.error(
            t('Trial or payment required for this feature.'),
            undefined,
            toastPaymentRequiredOptions(),
          )
        }
      },
    })
  },
})

const isError = computed(() => {
  return createCharacterDraft.isError.value || updateCharacterDraft.isError.value || buildQuery.isError.value
})

const isEditing = computed(() => !!characterBuildId.value || !!props.characterUsername)

const editingUsername = computed(() => {
  return buildQuery.data.value?.character?.username || ''
})
const copyText = useClipboard()

function copyShareCharacterUrl() {
  const url = window.location.origin
  const usernameUrl = `${url}/app/chat/${editingUsername.value}`

  copyText(usernameUrl)
}

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

const canManageCharacter = computed(() => canUseAIFeatures(user.value))

const viewMode = ref<CharacterBuilderEditViewMode>('preview')

const items = computed<MenuItemType[]>(() => [
  { id: 'preview', name: t('Preview'), icon: 'material-symbols:history-edu-outline-rounded', description: t('How it will look after approval'), onClick: () => viewMode.value = 'preview' },
  { id: 'original', name: t('Original'), icon: 'material-symbols:history-edu-rounded', description: t('How it looked before editing'), onClick: () => viewMode.value = 'original' },
])

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

const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)

function handleGoToChat() {
  sidebar.open.value = false
  navigateTo(`/app/chat/${editingUsername.value}?build-character`)
}

const route = useRoute()
const username = computed(() => route.params.username as string)
const isAlreadyChatting = computed(() => {
  // check if username is in the url matches with the character username
  return username.value === editingUsername.value
})

function handleApproved(characterId: number) {
  characterBuildId.value = characterId
}

const isSubmitButtonDisabled = computed(() => !form.values.prompt || hasFormErrors.value || !canManageCharacter.value)

function onResourceFetch() {
  if (buildQuery.isError.value) {
    buildQuery.refetch()
  }

  if (!isSubmitButtonDisabled.value) {
    submit()
  }
}
</script>

<template>
  <div class="flex flex-col h-dvh justify-between w-full absolute">
    <Navbar
      :title="isEditing ? t('Edit Character') : t('Create Character')"
      @back="emit('back')"
    />

    <CharacterBuilderSubscriptionAppNote
      v-if="user?.subscriptionStatus !== SubscriptionStatus.active && user?.subscriptionStatus !== SubscriptionStatus.trialing"
    />

    <div class="pt-2 flex-1 overflow-y-auto bg-white space-y-2">
      <template v-if="isEditing">
        <div class="px-6 text-xs text-gray-400 flex justify-between items-center">
          <T
            text="You are editing: {characterName}"
            :values="{ characterName: true }"
          >
            <template #characterName>
              <span v-if="isAlreadyChatting" class="text-blue-500">
                {{ buildQuery.data.value?.character!.name }}
              </span>
              <button
                v-else
                class="text-blue-500 focus:outline-primary focus:outline-offset-4 focus:outline-2 rounded-full cursor-pointer"
                @click="handleGoToChat"
              >
                {{ buildQuery.data.value?.character!.name }}
              </button>
            </template>
          </T>
        </div>

        <div class="flex flex-wrap gap-2 items-center px-6">
          <Button
            v-if="isEditing"
            class="btn btn-xs btn-dash btn-warning"
            icon="material-symbols:ios-share-rounded"
            icon-class="text-xl"
            :disabled="loading"
            @click="copyShareCharacterUrl"
          >
            {{ t("Share") }}
          </Button>

          <Button
            v-if="isEditing && !isAlreadyChatting"
            class="btn btn-xs btn-dash btn-secondary"
            icon="material-symbols:chat-paste-go-outline-rounded"
            icon-class="text-xl"
            :disabled="loading"
            @click="handleGoToChat"
          >
            {{ t("Send message") }}
          </Button>
        </div>
      </template>

      <SettingSection
        body-class="px-6"
      >
        <form class="flex flex-col gap-2" @submit="submit">
          <TextareaField
            autofocus
            path="prompt"
            textarea-class="textarea-sm textarea-primary w-full"
            :placeholder="t('A wise elder sharing life stories')"
            :label="t('Describe your character')"
            :disabled="!canManageCharacter"
            :rules="yupify(promptSchema, t(
              `Prompt must contain between {min} and {max} characters.`,
              promptSchemaChecks,
            ))"
          />

          <Button
            :loading="loading"
            class="btn btn-dash btn-primary w-fit"
            icon="material-symbols:auto-awesome-outline-rounded"
            :disabled="isSubmitButtonDisabled"
          >
            {{ !!buildQuery.data.value ? t("Regenerate") : t("Generate") }}
          </Button>
        </form>
      </SettingSection>

      <CommonResource
        :for="{
          data: buildQuery.data,
          isLoading: buildQuery.isLoading,
          isError,
          refetch: onResourceFetch,
        }"
        common-error-fallback-class="px-6 mt-8"
      >
        <template #not-found>
          <span aria-hidden="true" class="hidden">
            NO_CHARACTER_DRAFT_FOUND
          </span>
        </template>

        <SettingSection
          body-class="px-6 pt-2"
        >
          <div
            class="bg-radial-[at_bottom] from-blue-50 to-gray-50 rounded-2xl p-4 mb-4"
          >
            <div class="text-sm w-full h-full relative">
              <Menu.Root v-if="hasChanges">
                <Menu.Trigger class="absolute z-10 left-2 top-2 btn btn-primary btn-outline btn-xs" @click.stop.prevent>
                  {{ viewMode === "preview" ? t('Preview') : t('Original') }}
                  <Icon class="rotate-180 text-base" name="material-symbols:keyboard-arrow-up-rounded" />
                </Menu.Trigger>

                <Menu.Positioner>
                  <Menu.Content class="focus:outline-hidden shadow-2xl bg-base-100 rounded-box w-64 z-40 p-2">
                    <Menu.Item v-for="item in items" :id="item.id" :key="item.id" :value="item.id" class="cursor-pointer py-2 px-3 hover:bg-base-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-primary" tabindex="0" @click.stop.prevent="item.onClick">
                      <MenuItem :is="item" />
                    </Menu.Item>
                  </Menu.Content>
                </Menu.Positioner>
              </Menu.Root>

              <DiscardDraftButton
                v-if="hasChanges || !isEditing"
                class="absolute z-10 right-2 top-2"
                :character-build-id="characterBuildId"
                :is-past-due-visible="!canManageCharacter"
                :is-editing="isEditing"
              />

              <CharacterShowcase v-if="viewMode === 'preview'" :data="buildQuery.data.value?.draft!" />
              <CharacterShowcase v-if="viewMode === 'original'" :data="buildQuery.data.value?.character!" />

              <ApproveCharacterDraftForm
                :is-editing="isEditing"
                :previous-username="buildQuery.data.value?.character?.username"
                :discoverable="buildQuery.data.value?.character?.discoverable"
                :has-changes="hasChanges"
                @approved="handleApproved"
              />
            </div>
          </div>
        </SettingSection>
      </CommonResource>
    </div>
  </div>
</template>
