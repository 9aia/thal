<script setup lang="ts">
import type { MenuItem } from '~/components/ui/navigation/types'
import { categories } from '~/constants/discover'

const props = defineProps<{
  name: string
  username?: string
  categoryId?: number
  description?: string
  avatar?: string
}>()

const emit = defineEmits<{
  (e: 'edit'): void
  (e: 'delete'): void
  (e: 'chat'): void
}>()

const category = computed(() => {
  return categories.find(category => category.id === props.categoryId)
})

const copyUsername = useCopyUsername(toRef(() => props.username))

const items: MenuItem[] = [
  { id: 'edit-character', name: 'Edit character', icon: 'person_edit', onClick: () => emit('edit') },
  { id: 'delete-character', name: 'Delete character', icon: 'delete', onClick: () => emit('delete') },
  { id: 'share-character', name: 'Share character', icon: 'ios_share', onClick: () => copyUsername() },
  { id: 'chat', name: 'Message character', icon: 'chat', onClick: () => emit('chat') },
]
</script>

<template>
  <div
    role="button"
    class="px-3 hover:bg-gradient-1 flex gap-2 rounded items-center group relative"
  >
    <Avatar :name="name" class="w-10 text-sm bg-gray-300 text-gray-800" type="button" />

    <div
      class="flex-1 flex flex-col justify-center"
    >
      <div class="py-1">
        <div class="flex gap-2 items-center text-base text-gray-900">
          {{ name }}

          <div
            v-if="username"
            class="text-gray-600 flex gap-1 font-normal"
          >
            @{{ username }}
          </div>
        </div>

        <div v-if="category" class="text-sm text-gray-600 flex gap-1 items-center">
          <Badge no-bg class="bg-transparent border-none flex gap-1 px-0 py-3 text-xs text-gray-500">
            <Icon :name="category?.icon" class="" style="font-size: 1.15rem" />

            {{ category?.name }}
          </Badge>
        </div>
      </div>

      <div
        class="flex right-0 absolute gap-1 py-1 bg-gradient-to-r from-transparent via-white to-white"
      >
        <div class="dropdown dropdown-end">
          <button class="btn btn-circle btn-ghost text-gray-800" @click.stop.prevent="updateRedirectUrl">
            <Icon>
              more_vert
            </Icon>
          </button>

          <Menu :items="items" item-class="py-2" @click.stop.prevent />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover\:bg-gradient-1:hover {
  background: radial-gradient(circle, theme('colors.magenta.50'), theme('colors.white'));
}
</style>
