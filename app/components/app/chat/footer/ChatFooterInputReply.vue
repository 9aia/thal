<script setup lang="ts">
import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { replies } from '~/store'

const queryClient = useQueryClient()
const route = useRoute()
const { t } = useI18nExperimental()

const username = computed(() => route.params.username as string)
const replying = computed(() => replies[username.value])
const data = computed(() => queryClient.getQueryData(queryKeys.chat(username)))

const displayName = computed(() => getContactName(data.value))

const replyDisplayName = computed(() => replying.value.from === 'user'
  ? t('You')
  : displayName.value,
)

function removeReply() {
  delete replies[username.value]
}
</script>

<template>
  <div class="border-l-4 border-blue-100 bg-blue-50 p-3 relative w-full">
    <h3 class="text-sm font-medium text-blue-500">
      {{ replyDisplayName }}
    </h3>

    <p class="text-xs text-gray-600 line-clamp-3">
      {{ replyMessage }}
    </p>

    <Button
      class="btn btn-circle btn-sm btn-ghost absolute top-1 right-1"

      icon="material-symbols:close-rounded"
      icon-class="text-xl"
      @click="removeReply"
    />
  </div>
</template>
