<script setup lang="ts">
import { useOnline } from '@vueuse/core'
import queryKeys from '~/queryKeys'

const { t } = useI18nExperimental()
const isOnline = useOnline()
const route = useRoute()
const username = computed(() => route.params.username as string)
const headers = useRequestHeaders(['cookie'])

const characterQuery = useCharacterQuery(username)

const contactQuery = useServerQuery({
  queryKey: queryKeys.contact(username),
  queryFn: () => $fetch(`/api/contact/${username.value}` as `/api/contact/:username`, {
    headers,
  }),
})

const isContact = computed(() => !!contactQuery.data.value?.id)
const contactNames = computed(() => getContactName({
  username: username.value,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))
</script>

<template>
  <div class="sm:max-w-5xl md:max-w-6xl lg:max-w-9xl mx-auto h-full">
    <NonContactProfileCard
      v-if="!isContact"
      :avatar-name="contactNames.avatarName"
      :display-name="contactNames.displayName"
      :description="characterQuery.data.value!.description"
      :username="username"
      class="mb-4"
    />

    <ExperimentalAlert />

    <!-- <History /> -->

    <div class="sticky bottom-0 right-0 flex justify-end">
      <!-- <GoToBottomButton /> -->
    </div>
  </div>
</template>
