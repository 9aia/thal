<script setup lang="ts">
import { t } from '@psitta/vue'
import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { buildCharacter, drawers, isRootDrawerOpen } from '~/store'
import type { Character } from '~/types'

const emit = defineEmits<{
  (e: 'close'): void
}>()

useAutoRedirect({
  query: { drawer: ['list'] },
})

const localWithDefaultRegion = useLocaleDefaultRegion()

const myCharactersQuery = useQuery({
  queryKey: queryKeys.myCharacters,
  queryFn: () => $fetch('/api/character', {
    query: {
      locale: localWithDefaultRegion.value,
    },
  }),
})

const deleteCharacter = ref(false)
const characterToDelete = ref<Character>()

function handleDeleteCharacter(character: Character) {
  deleteCharacter.value = true
  characterToDelete.value = character
}

async function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false
  await navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <div v-if="drawers.myCharacters" class="flex flex-col h-dvh justify-between">
    <Navbar :title="t('My Characters')" @click="emit('close')" />

    <div class="flex-1 pt-2 pb-4overflow-y-auto bg-white">
      <SettingHeader
        class="mb-4"
        :title="t('Characters')"
        icon="material-symbols:manage-accounts-rounded"
        icon-class="text-gray-100"
        :description="t('Create a custom character that matches your specific goals in learning English.')"
      />

      <div class="py-4 mt-4">
        <SettingSection
          :title="t('Characters')"
          class="px-4"
        >
          <CommonResource :for="myCharactersQuery">
            <div class="h-full">
              <ul>
                <li
                  v-for="character in myCharactersQuery.data.value"
                  :key="`character-${character.id}`"
                  class="group"
                >
                  <CharacterItem
                    :name="character.characterLocalizations?.[0]?.name"
                    :username="character.usernames?.username || undefined"
                    :category-id="character.categoryId"
                    @delete="handleDeleteCharacter(character as unknown as Character)"
                    @edit="buildCharacter(character.id)"
                    @chat="handleGoToChat(character.usernames?.username as string)"
                    @click="buildCharacter(character.id)"
                  />
                </li>
              </ul>
            </div>
          </CommonResource>

          <div>
            <ul>
              <li class="group mt-2" @click="buildCharacter(null)">
                <div class="cursor-pointer flex w-full gap-2 justify-between items-center">
                  <MenuItem
                    :is="{ id: 'add-character', name: 'Create character', icon: 'material-symbols:add' }"
                    class="py-2"
                  />
                </div>
              </li>
            </ul>
          </div>

          <CharacterDeleteModal
            v-model="deleteCharacter"
            :character="characterToDelete!"
          />
        </SettingSection>
      </div>
    </div>
  </div>
</template>
