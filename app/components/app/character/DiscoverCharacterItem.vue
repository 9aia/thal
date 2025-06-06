<script setup lang="ts">
import { t } from '@psitta/vue'
import { categories } from '~/constants/discover'
import { isRootDrawerOpen, openContactView } from '~/store'

const props = defineProps<{
  name: string
  description: string
  username: string
  categoryId: number
  showCopy?: boolean
  showSendMessage?: boolean
}>()

async function sendMessage() {
  isRootDrawerOpen.value = false
  await navigateTo(`/app/chat/${props.username}`)
}

function onClick() {
  if (props.showSendMessage && props.username)
    sendMessage()
}

const category = computed(() => {
  return categories.find(category => category.id === props.categoryId)
})

const avatarName = computed(() => {
  return props.name || props.username
})

const displayName = computed(() => {
  return props.name || `@${props.username}`
})
</script>

<template>
  <div
    role="button"
    class="py-1 flex gap-3 items-center group cursor-pointer"
    @click.prevent="onClick"
  >
    <Avatar
      :name="avatarName"
      type="button"
      wrapper-class="bg-neutral text-neutral-content"
      @click.stop="openContactView(username)"
    >
      <template #icon />
    </Avatar>

    <div class="flex-1 flex flex-col justify-center">
      <div class="flex justify-between gap-1">
        <div class="flex flex-col w-full">
          <div class="flex gap-2 items-center text-base text-gray-900">
            {{ displayName }}
          </div>

          <div v-if="category" class="text-sm text-gray-600 flex justify-between gap-1 items-center">
            <Badge no-bg class="bg-transparent border-none flex gap-1 px-0 py-3 text-xs text-black">
              <Icon :name="category?.icon" class="text-xl" />
              {{ t(category?.name) }}
            </Badge>
          </div>

          <div
            class="text-xs text-gray-600 line-clamp-2 mt-1"
            :title="description"
          >
            {{ description }}
          </div>
        </div>

        <div class="flex gap-2 items-center">
          <Button
            v-if="showSendMessage && username"
            class="btn btn-neutral btn-ghost btn-circle"
          >
            <Icon name="material-symbols:chat-outline-rounded" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
