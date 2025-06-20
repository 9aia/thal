<script setup lang="ts">
import queryKeys from '~/queryKeys'
import { inReplyTos } from '~/store'

const route = useRoute()
const { t } = useI18nExperimental()

const username = computed(() => route.params.username as string)
const inReplyTo = computed(() => inReplyTos[username.value])

const headers = useRequestHeaders(['cookie'])
const contactQuery = useServerQuery({
  queryKey: queryKeys.contact(username),
  queryFn: () => $fetch(`/api/contact/${username.value}` as `/api/contact/:username`, {
    headers,
  }),
})

const characterQuery = useCharacterQuery(username)

const contactNames = computed(() => getContactName({
  username: username.value,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))

const displayName = computed(() => inReplyTo.value.from === 'user'
  ? t('You')
  : contactNames.value.displayName,
)

function removeReply() {
  delete inReplyTos[username.value]
}
</script>

<template>
  <div class="border-l-4 border-blue-100 bg-blue-50 p-3 relative w-full">
    <h3 class="text-sm font-medium text-blue-500">
      {{ displayName }}
    </h3>

    <p class="text-xs text-gray-600 line-clamp-3">
      {{ inReplyTo.content }}
    </p>

    <Button
      class="btn btn-circle btn-sm btn-ghost absolute top-1 right-1"

      icon="material-symbols:close-rounded"
      icon-class="text-xl"
      @click="removeReply"
    />
  </div>
</template>
