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

    <div class="flex-1 p-4 overflow-y-auto bg-white">
      <div class="pt-4 text-center">
        <div class="text-gray-800 flex items-center justify-center">
          <Icon name="material-symbols:manage-accounts-outline" class="text-8xl" />
        </div>

        <h2 class="text-lg px-4 py-2 text-gray-800">
          {{ t("Characters") }}
        </h2>

        <p class="px-4 text-sm text-gray-800">
          {{ t("Create a custom character that matches your specific goals in learning English.") }}
        </p>
      </div>

      <div class="py-4">
        <SettingSection :title="t('Characters')" title-class="px-4">
          <Teleport to="body">
            <CharacterDeleteModal
              v-model="deleteCharacter"
              :character="characterToDelete!"
            />
          </Teleport>

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
              <li class="group px-4 mt-2" @click="buildCharacter(null)">
                <div class="cursor-pointer flex w-full gap-2 justify-between items-center">
                  <MenuItem
                    :is="{ id: 'add-character', name: 'Create character', icon: 'material-symbols:add' }"
                    class="py-2"
                  />
                </div>
              </li>
            </ul>
          </div>
        </SettingSection>
      </div>
    </div>
  </div>
</template>
