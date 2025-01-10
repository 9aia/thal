<script setup lang="ts">
import { categories } from '~/constants/discover'
import { isRootDrawerOpen } from '~/store'

const props = defineProps<{
  name: string
  description: string
  username: string
  categoryId: number
  avatar?: string
  showCopy?: boolean
  showSendMessage?: boolean
}>()

function sendMessage() {
  isRootDrawerOpen.value = false

  navigateTo(`/app/chat/${props.username}`)
}

function onClick() {
  if (props.showSendMessage && props.username)
    sendMessage()
}

const category = computed(() => {
  return categories.find(category => category.id === props.categoryId)
})
</script>

<template>
  <div
    tabindex="0"
    role="button"
    class="py-1 flex gap-2 rounded items-center group"
    @click.prevent="onClick"
  >
    <Avatar :name="name" class="w-10 text-sm" type="button" />

    <div class="flex-1 flex flex-col justify-center">
      <div class="flex justify-between">
        <div class="flex flex-col">
          <div class="flex gap-2 items-center text-base text-gray-900">
            {{ name }}

            <Username :username="username" :show-copy="true" />
          </div>

          <div v-if="category" class="text-sm text-gray-600 flex gap-1 items-center">
            <Badge class="bg-transparent border-none flex gap-1 px-0 py-3 text-xs text-gray-500">
              <Icon :name="category?.icon" class="" style="font-size: 1.15rem" />

              {{ category?.name }}
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
          <button
            v-if="showSendMessage && username"
            class="text-gray-800 hover:text-gray-600"
          >
            <Icon name="chat" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
