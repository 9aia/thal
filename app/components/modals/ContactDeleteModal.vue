<script setup lang="ts">
import { useI18n } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  contactUsername: string
}>()

const { t } = useI18n()

const isOpen = defineModel({ default: false })

const queryClient = useQueryClient()

const {
  mutate,
} = useMutation({
  mutationFn: async () => {
    return $fetch(`/api/contact/${props.contactUsername}` as '/api/contact/:username', {
      method: 'DELETE',
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
      queryKey: queryKeys.contactInfo(props.contactUsername),
    })

    isOpen.value = false
  },
})
</script>

<template>
  <Modal v-model="isOpen">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4 text-slate-900">
        {{ t("Deleting Contact") }}
      </h1>

      <p class="mb-4 mt-4 text-slate-800">
        {{ t("Are you sure you want to delete this contact?") }}
      </p>
    </template>

    <template #actions>
      <Btn
        class="btn-error"
        @click.prevent="mutate()"
      >
        {{ t('Delete contact') }}
      </Btn>

      <Btn
        class="btn btn-primary"
        @click="isOpen = false"
      >
        {{ t('Cancel') }}
      </Btn>
    </template>
  </Modal>
</template>
