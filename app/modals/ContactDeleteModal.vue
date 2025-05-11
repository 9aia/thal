<script setup lang="ts">
import { t } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  contactUsername: string
}>()

const queryClient = useQueryClient()

const isOpen = defineModel({ default: false })

const localeDefaultRegion = useLocaleDefaultRegion()

const {
  mutate,
} = useMutation({
  mutationFn: async () => {
    return $fetch(`/api/contact/${props.contactUsername}` as '/api/contact/:username', {
      method: 'DELETE',
      query: {
        locale: localeDefaultRegion.value,
      },
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.contacts,
    })

    queryClient.invalidateQueries({
      queryKey: queryKeys.chat(props.contactUsername),
    })

    queryClient.invalidateQueries({
      queryKey: queryKeys.contactInfo(localeDefaultRegion, props.contactUsername),
    })

    queryClient.invalidateQueries({
      queryKey: queryKeys.chats,
    })

    isOpen.value = false
  },
})
</script>

<template>
  <Modal v-model="isOpen">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4 text-gray-900">
        {{ t("Deleting Contact") }}
      </h1>

      <p class="mb-4 mt-4 text-gray-800">
        {{ t("Are you sure you want to delete this contact?") }}
      </p>
    </template>

    <template #actions>
      <Button
        class="btn-error text-white"
        @click.prevent="mutate()"
      >
        {{ t('Delete contact') }}
      </Button>

      <Button
        class="btn-primary"
        @click="isOpen = false"
      >
        {{ t('Cancel') }}
      </Button>
    </template>
  </Modal>
</template>
