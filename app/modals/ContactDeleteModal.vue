<script setup lang="ts">
import { T, t } from '@psitta/vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import type { Contact } from '~/types'

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
    queryClient.setQueryData(queryKeys.contact(props.contactUsername), null)
    queryClient.setQueryData(queryKeys.contacts, (old: Contact[]) => old.filter(contact => contact.username !== props.contactUsername))

    isOpen.value = false
  },
})
</script>

<template>
  <Modal v-model="isOpen">
    <template #default>
      <h1 class="px-6 pt-6 mb-2 mt-4 text-sm text-black">
        {{ t("Deleting Contact") }}
      </h1>

      <p class="px-6 mb-4 mt-4 text-gray-800">
        <T
          text="You are about to delete {inlineContact}  from your contacts. Are you sure you want to delete it?"
          :values="{ inlineContact: true }"
        >
          <template #inlineContact>
            <span class="text-warning">
              {{ contactName }}
            </span>
            <span class="text-warning">
              (@{{ contactUsername }})
            </span>
          </template>
        </T>
      </p>
    </template>

    <template #actions>
      <Button
        class="btn btn-soft btn-warning "
        :disabled="isPending"
        @click.prevent="deleteContact()"
      >
        {{ t('Delete contact') }}
      </Button>

      <Button
        class="btn btn-primary"
        :disabled="isPending"
        @click="isOpen = false"
      >
        {{ t('Cancel') }}
      </Button>
    </template>
  </Modal>
</template>
