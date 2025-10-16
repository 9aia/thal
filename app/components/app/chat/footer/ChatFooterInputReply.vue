<script setup lang="ts">
import { inReplyTos } from '~/store'

const route = useRoute()
const { t } = useI18nExperimental()

const username = computed(() => route.params.username as string)
const inReplyTo = computed(() => inReplyTos[username.value])

const contactQuery = useContactQuery(username)
const characterQuery = useCharacterQuery(username)

const queryPromises = [
  contactQuery.suspense(),
  characterQuery.suspense(),
]

await Promise.all(queryPromises)

const contactNames = computed(() => getContactName({
  username: username.value,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))

const displayName = computed(() => inReplyTo.value?.from === 'user'
  ? t('You')
  : contactNames.value.displayName,
)

function removeReply() {
  delete inReplyTos[username.value]
}
</script>

<template>
  <div class="flex flex-col items-end justify-center w-full px-2">
    <div class="flex w-full justify-end items-center gap-1 text-xs text-blue-500 mb-1 pr-4">
      <Icon name="material-symbols:reply-rounded" class="text-xs" />
      {{ t('Replying to') }}
    </div>

    <div class="bg-radial-[at_bottom] from-blue-50 to-white py-2 px-3 relative rounded-2xl w-full">
      <h3 class="text-sm text-blue-500 mb-1">
        {{ displayName }}
      </h3>

      <p class="text-xs text-blue-500 line-clamp-3">
        {{ inReplyTo?.content }}
      </p>

      <Button
        class="btn btn-circle btn-sm btn-ghost absolute top-1 right-1"
        icon="material-symbols:close-rounded"
        icon-class="text-xl"
        @click="removeReply"
      />
    </div>
  </div>
</template>
