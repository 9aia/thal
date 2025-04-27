<script setup lang="ts">
import { Menu } from '@ark-ui/vue/menu'
import { t } from '@psitta/vue'
import type { MenuItemType } from '~/components/ui/navigation/types'
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

const items: MenuItemType[] = [
  { id: 'edit-character', name: 'Edit character', icon: 'material-symbols:person-edit-outline', onClick: () => emit('edit') },
  { id: 'share-character', name: 'Share character', icon: 'material-symbols:ios-share', onClick: () => copyUsername() },
  { id: 'chat', name: 'Message character', icon: 'material-symbols:chat-outline', onClick: () => emit('chat') },
  { id: 'delete-character', name: 'Delete character', icon: 'material-symbols:delete-outline', onClick: () => emit('delete'), meaning: 'danger' },
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
            <Icon :name="category?.icon" style="font-size: 1.15rem" />

            {{ t(category?.name) }}
          </Badge>
        </div>
      </div>

      <div
        class="flex right-0 absolute gap-1 py-1 bg-gradient-to-r from-transparent via-white to-white"
      >
        <Menu.Root>
          <Menu.Trigger class="btn btn-circle btn-ghost text-gray-800" @click.stop.prevent>
            <Icon>
              material-symbols:more-vert
            </Icon>
          </Menu.Trigger>
          <Menu.Positioner>
            <Menu.Content class="shadow-sm bg-base-100 rounded-box w-52 z-40 p-2 focus:outline-none">
              <Menu.Item v-for="item in items" :id="item.id" :key="item.id" :value="item.id" class="py-2 px-3 hover:bg-base-200 rounded-lg" @click.stop.prevent="item.onClick">
                <MenuItem :is="item" />
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Menu.Root>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hover\:bg-gradient-1:hover {
  background: radial-gradient(circle, theme('colors.magenta.50'), theme('colors.white'));
}
</style>
