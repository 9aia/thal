<script setup lang="ts">
import { useI18n } from '@psitta/vue'
import queryKeys from '~/queryKeys'
import { buildPersona, drawers, isRootDrawerOpen, personaBuilderData } from '~/store'
import type { Persona } from '~/types'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const { t } = useI18n()

const {
  data: personas,
  isError,
  isPending,
  refetch,
} = await useServerQuery('/api/persona', {
  queryKey: queryKeys.myPersonas,
})

const deletePersona = ref(false)
const personaToDelete = ref<Persona>()

function handleDeletePersona(persona: Persona) {
  deletePersona.value = true
  personaToDelete.value = persona
}

function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false

  navigateTo(`/app/chat/${username}`)
}
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        <Button size="sm" class="btn-ghost btn-circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Button>
        {{ t("My Characters") }}
      </h1>
    </Navbar>

    <div class="py-4 flex flex-col flex-1 overflow-y-auto bg-white gap-4">
      <header class="text-center">
        <div class="text-primary flex items-center justify-center">
          <Icon name="manage_accounts" style="font-size: 5rem" />
        </div>

        <h2 class="text-lg font-bold px-4 py-2">
          {{ t("Characters") }}
        </h2>

        <p class="px-4 text-sm text-gray-900">
          {{ t("Create a custom character that matches your specific goals in learning English.") }}
        </p>
      </header>

      <SettingSection :title="t('Characters')" title-class="px-4">
        <StyledResource
          :error="isError"
          :loading="isPending"
          @execute="refetch"
        >
          <ul>
            <li
              v-for="persona in personas"
              :key="`persona-${persona.id}`"
            >
              <PersonaItem
                :name="persona.name"
                :username="persona.username || undefined"
                :category-id="persona.categoryId"
                @delete="handleDeletePersona(persona as unknown as Persona)"
                @edit="buildPersona(persona as unknown as Persona)"
                @click="handleGoToChat(persona.username as string)"
              />
            </li>

            <li class="group px-4 mt-2" @click="buildPersona(null)">
              <div>
                <div class="cursor-pointer flex w-full gap-2 justify-between items-center py-2">
                  <MenuItem
                    :is="{ id: 'add-persona', name: 'Create character', icon: 'add' }"
                    class="py-2"
                  />
                </div>
              </div>
            </li>
          </ul>
        </StyledResource>
      </SettingSection>

      <PersonaDeleteModal
        v-model="deletePersona"
        :persona="personaToDelete!"
      />
    </div>
  </div>
</template>
