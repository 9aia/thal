<script setup lang="ts">
import { T, t } from '@psitta/vue'

const props = defineProps<{
  username: string
}>()
const isOpen = defineModel({ default: false })

const contactQuery = useContactQuery(toRef(() => props.username))
const characterQuery = useCharacterQuery(toRef(() => props.username))

const contactNames = computed(() => getContactName({
  username: props.username,
  contactName: contactQuery.data.value?.name,
  characterName: characterQuery.data.value?.name,
}))

const clearHistoryMutation = useClearHistoryMutation(toRef(() => props.username), {
  onSuccess: () => {
    isOpen.value = false
  },
})
</script>

<template>
  <Modal
    v-model="isOpen"
    :title="t('Clearing Chat History')"
    show-close-button
    no-scroll
  >
    <template #default>
      <p class="px-8 text-sm text-black">
        <T
          text="You are about to clear all chat history with {inlineContact}. This action cannot be undone. Are you sure you want to continue?"
          :values="{ inlineContact: true }"
        >
          <template #inlineContact>
            <span class="text-warning">
              {{ contactNames.displayName }}
            </span>
            <span class="text-warning">
              (@{{ username }})
            </span>
          </template>
        </T>
      </p>
    </template>

    <template #actions>
      <Button
        class="btn btn-soft btn-warning"
        :loading="clearHistoryMutation.isPending.value"
        @click.prevent="clearHistoryMutation.mutate()"
      >
        {{ t('Clear history') }}
      </Button>

      <Button
        class="btn btn-primary"
        :disabled="clearHistoryMutation.isPending.value"
        @click="isOpen = false"
      >
        {{ t('Cancel') }}
      </Button>
    </template>
  </Modal>
</template>
