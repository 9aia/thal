<script setup lang="ts">
import { t } from '@psitta/vue'
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'
import { manageContact, openContactView } from '~/store'

const props = defineProps<{
  avatarName: string
  displayName: string
  description?: string
  username: string
}>()

const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)

const truncatedDescription = computed(() => {
  if (!props.description)
    return null

  return props.description.length > 100 ? `${props.description.slice(0, 64)}...` : props.description
})

function addContact() {
  manageContact(props.username, props.displayName)
  sidebar.push('manage-contact')
}
</script>

<template>
  <div
    class="bg-radial-[at_top] from-orange-50 to-gray-50 text-gray-800 text-center sm:max-w-sm mx-auto rounded-3xl"
  >
    <div class="py-6 px-6">
      <Avatar
        :name="avatarName"
        type="button"
        size="xl"
        class="mx-auto"
        wrapper-class="bg-neutral text-neutral-content"
        @click="openContactView(username)"
      />

      <h2 class="text-gray-900 text-center mb-1 mt-2">
        {{ displayName }}
      </h2>

      <p class="text-black text-xs mb-4">
        @{{ username }}
      </p>

      <small v-if="truncatedDescription" class="text-gray-500 text-xs">
        ~ {{ truncatedDescription }}
      </small>

      <p class="text-black text-xs mb-4 mt-4">
        {{ t('Not a contact') }}
      </p>

      <div class="card-actions justify-center">
        <Button
          class="btn btn-soft btn-primary"
          icon="material-symbols:person-add-outline-rounded"
          @click="addContact()"
        >
          {{ t('Add') }}
        </Button>
      </div>
    </div>
  </div>
</template>
