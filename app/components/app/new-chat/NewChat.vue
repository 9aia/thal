<script setup lang="ts">
import { t } from "@psitta/vue"
import { drawers, personaBuilderData } from "~/store"
import type { Persona } from "~/types"
import { useDiscoverPersonasModal } from "~/composables/useDiscoverPersonasModal"
import type { MenuItem } from "~~/layers/ui/components/navigation/types"
import queryKeys from "~/queryKeys"

const emit = defineEmits<{
  (e: "close"): void
}>()

const discoverPersonasModal = useDiscoverPersonasModal()

function handleCreatePersona() {
  drawers.personaBuilder = true
  personaBuilderData.value = null
}

const generalItems: MenuItem[] = [
  { id: "new-contact", icon: "person_add", name: "New contact", action: "new-contact-drawer", onSubmit: () => drawers.newContact = true },
  { id: "create-persona", icon: "person_edit", name: "Build persona", action: "build-persona-drawer", onSubmit: () => handleCreatePersona() },
]

const discoverItems: MenuItem[] = [
  { id: "discover", icon: "collections_bookmark", name: "Personas", action: "open-personas", onSubmit: () => discoverPersonasModal.open() },
]

const {
  data: contacts,
  isError,
  isPending,
  refetch,
} = await useServerQuery("/api/contact", {
  queryKey: queryKeys.contacts,
})
</script>

<template>
  <Navbar>
    <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
      <Btn size="sm" class="btn-ghost btn-circle" @click="emit('close')">
        <Icon name="arrow_back" />
      </Btn>
      {{ t("New chat") }}
    </h1>
  </Navbar>

  <div class="py-4 flex-1 overflow-y-auto bg-white space-y-4">
    <SettingSection class="px-4">
      <MenuGroup
        class="p-0 w-full"
        :items="generalItems"
      />
    </SettingSection>

    <SettingSection :title="t('Discover')" class="px-4">
      <MenuGroup class="p-0 w-full" :items="discoverItems" />
    </SettingSection>

    <SettingSection v-if="contacts?.length" :title="t('Contacts')" title-class="px-4">
      <Resource
        :error="isError"
        :loading="isPending"
        @execute="refetch"
      >
        <ContactItem
          v-for="contact in contacts"
          :key="`contact-${contact.id}`"
          :name="contact.name"
          :description="contact.description"
          @click="navigateTo(`/app/chat/${contact.username}`)"
        />
      </Resource>
    </SettingSection>
  </div>
</template>
