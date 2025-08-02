<script setup lang="ts">
const props = defineProps<{
  isEditing: boolean
  isAlreadyChatting: boolean
  loading: boolean
  editingUsername?: string
}>()

const emit = defineEmits<{
  (e: 'message'): void
  (e: 'delete'): void
}>()

const deleteCharacter = ref(false)

const { t } = useI18nExperimental()
const copyText = useClipboard()

function copyShareCharacterUrl() {
  const url = window.location.origin
  const usernameUrl = `${url}/app/chat/${props.editingUsername}`

  copyText(usernameUrl)
}
</script>

<template>
  <div class="w-full flex justify-center mt-2 gap-8 px-4">
    <LabeledIconButton
      v-if="isEditing && !isAlreadyChatting"
      icon="material-symbols:chat-outline-rounded"
      :label="t('Message')"
      :disabled="loading"
      @click="emit('message')"
    />

    <LabeledIconButton
      v-if="isEditing"
      icon="material-symbols:delete-outline-rounded"
      :label="t('Delete')"
      :disabled="loading"
      @click="deleteCharacter = true"
    />

    <LabeledIconButton
      v-if="isEditing"
      icon="material-symbols:ios-share-rounded"
      :label="t('Share')"
      :disabled="loading"
      @click="copyShareCharacterUrl()"
    />
  </div>

  <LazyCharacterDeleteModal
    v-if="deleteCharacter && editingUsername"
    v-model="deleteCharacter"
    :character-username="editingUsername"
    @delete="emit('delete')"
  />
</template>
