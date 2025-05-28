<script setup lang="ts">
import { t } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

const props = defineProps<{
  contactUsername: string
  contactName: string
}>()
const isOpen = defineModel({ default: false })

const queryClient = useQueryClient()
const localeDefaultRegion = useLocaleDefaultRegion()

const { mutate: deleteContact, isPending } = useMutation({
  mutationFn: () => $fetch(`/api/contact/${props.contactUsername}`, {
    method: 'DELETE',
    query: {
      locale: localeDefaultRegion.value,
    },
  }),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.contacts,
    })

    queryClient.invalidateQueries({
      queryKey: queryKeys.contact(props.contactUsername),
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
        {{ t("You are about to delete {contactName} (@{contactUsername}) from your contacts. Are you sure you want to delete it?", {
          contactName: props.contactName,
          contactUsername: props.contactUsername,
        }) }}
      </p>
    </template>

    <template #actions>
      <Button
        class="btn-error text-white"
        :disabled="isPending"
        @click.prevent="deleteContact()"
      >
        {{ t('Delete contact') }}
      </Button>

      <Button
        class="btn-primary"
        :disabled="isPending"
        @click="isOpen = false"
      >
        {{ t('Cancel') }}
      </Button>
    </template>
  </Modal>
</template>
