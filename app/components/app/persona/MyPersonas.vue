<script setup lang="ts">
import { t } from '@psitta/vue'
import { useQuery } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'
import { buildPersona, drawers, isRootDrawerOpen } from '~/store'
import type { Persona } from '~/types'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const {
  data: personas,
  isPending,
  isError,
  refetch,
} = useQuery({
  queryKey: queryKeys.myPersonas,
  queryFn: () => $fetch('/api/persona'),
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
  <div v-if="drawers.myPersonas" class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-gradient-1 flex items-center gap-1">
        <Button size="sm" class="btn-ghost" shape="circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Button>
        {{ t("My Characters") }}
      </h1>
    </Navbar>

    <div class="flex-1 overflow-y-auto bg-white">
      <div class="pt-4 text-center">
        <div class="text-gray-800 flex items-center justify-center">
          <Icon name="manage_accounts" style="font-size: 5rem" />
        </div>

        <h2 class="text-lg px-4 py-2 text-gray-800">
          {{ t("Characters") }}
        </h2>

        <p class="px-4 text-sm text-gray-800">
          {{ t("Create a custom character that matches your specific goals in learning English.") }}
        </p>
      </div>

      <div class="py-4 overflow-y-hidden">
        <SettingSection :title="t('Characters')" title-class="px-4">
          <Teleport to="body">
            <PersonaDeleteModal
              v-model="deletePersona"
              :persona="personaToDelete!"
            />
          </Teleport>

          <StyledResource
            :loading="isPending"
            :error="isError"
            @execute="refetch"
          >
            <div class="h-full">
              <ul>
                <li
                  v-for="persona in personas"
                  :key="`persona-${persona.id}`"
                  class="group"
                >
                  <PersonaItem
                    :name="persona.name"
                    :username="persona.username || undefined"
                    :category-id="persona.categoryId"
                    @delete="handleDeletePersona(persona as unknown as Persona)"
                    @edit="buildPersona(persona as unknown as Persona)"
                    @chat="handleGoToChat(persona.username as string)"
                    @click="buildPersona(persona as unknown as Persona)"
                  />
                </li>
              </ul>
            </div>
          </StyledResource>

          <div>
            <ul>
              <li class="group px-4 mt-2" @click="buildPersona(null)">
                <div class="cursor-pointer flex w-full gap-2 justify-between items-center">
                  <MenuItem
                    :is="{ id: 'add-persona', name: 'Create character', icon: 'add' }"
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

<style scoped>
.text-gradient-1 {
  background: radial-gradient(theme('colors.blue.500'), theme('colors.cyan.500')) !important;
  -webkit-background-clip: text !important;
  background-clip: text !important;
  color: transparent !important;
}
</style>
