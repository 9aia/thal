<script setup lang="ts">
import { t } from '@psitta/vue'
import { buildCharacter } from '~/store'

definePageMeta({
  layout: 'settings',
  middleware: 'auth',
  pageTransitionType: 'slide',
})

useAutoRedirect()

const router = useRouter()

const myCharactersQuery = useCharacterListQuery()
await myCharactersQuery.suspense()

const deleteCharacter = ref(false)
const characterUsernameToDelete = ref<string>()

function handleDeleteCharacter(username: string) {
  deleteCharacter.value = true
  characterUsernameToDelete.value = username
}

async function handleGoToChat(username: string) {
  await navigateTo(`/app/chat/${username}`)
}

function handleCreateCharacter(characterId?: number | null, username?: string) {
  buildCharacter(characterId)

  if (username)
    navigateTo(`/app/settings/build-character/${username}`)
  else
    navigateTo(`/app/settings/build-character`)
}
</script>

<template>
  <div class="flex flex-col h-dvh justify-between w-full absolute">
    <Navbar
      :title="t('My Characters')"
      @back="router.back()"
    />

    <div class="pt-2 flex-1 pb-4 overflow-y-auto bg-white">
      <SettingHeader
        class="px-4 mb-6"
        :title="t('Characters')"
        icon="material-symbols:manage-accounts-rounded"
        icon-class="text-gray-100"
        :description="t('Create a custom character that matches your specific goals in learning English.')"
      />

      <div class="mt-4">
        <SettingSection
          :title="t('Characters')"
          title-class="px-6"
          body-class="pl-4"
        >
          <CommonResource
            :for="myCharactersQuery"
            common-error-fallback-class="px-2 mt-4 mb-8"
            :empty-message="t('You have no characters yet.')"
          >
            <div class="h-full px-2">
              <ul class="space-y-3">
                <li
                  v-for="character in myCharactersQuery.data.value"
                  :key="`character-${character.id}`"
                  class="group"
                >
                  <CharacterItem
                    :name="character.characterLocalizations?.[0]?.name"
                    :username="character.usernames?.text || undefined"
                    :category-id="character.categoryId"
                    @delete="handleDeleteCharacter(character.usernames?.text as string)"
                    @edit="handleCreateCharacter(character.id, character.usernames?.text as string)"
                    @chat="handleGoToChat(character.usernames?.text as string)"
                    @click="handleCreateCharacter(character.id, character.usernames?.text as string)"
                  />
                </li>
              </ul>
            </div>
          </CommonResource>

          <div class="pl-6 mt-4 -translate-x-3.5 w-full">
            <Button
              class="w-full flex items-center justify-start cursor-pointer py-1 border-b-2 border-transparent focus:border-b-primary focus:outline-hidden"
              icon="material-symbols:add-rounded"
              @click="handleCreateCharacter()"
            >
              {{ t('Create character') }}
            </Button>
          </div>

          <LazyCharacterDeleteModal
            v-if="deleteCharacter && characterUsernameToDelete"
            v-model="deleteCharacter"
            :character-username="characterUsernameToDelete"
          />
        </SettingSection>
      </div>
    </div>
  </div>
</template>
