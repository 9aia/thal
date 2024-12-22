<script setup lang="ts">
import { t } from "@psitta/vue"
import { useForm } from "vee-validate"
import { refDebounced } from "@vueuse/core"
import { drawers, isRootDrawerOpen, personaBuilderData } from "~/store"
import type { MenuItem } from "~~/layers/ui/components/navigation/types"
import queryKeys from "~/queryKeys"

const emit = defineEmits<({
  (e: "close"): void
})>()

function handleCreatePersona() {
  drawers.personaBuilder = true
  personaBuilderData.value = null
}

const generalItems: MenuItem[] = [
  { id: "new-contact", icon: "person_add", name: t("New contact"), onClick: () => drawers.newContact = true },
  { id: "create-persona", icon: "person_edit", name: t("Build character"), onClick: () => handleCreatePersona() },
]

function goToDiscover() {
  isRootDrawerOpen.value = false
  navigateTo("/app/discover")
}

const discoverItems: MenuItem[] = [
  { id: "discover", icon: "collections_bookmark", name: t("Characters"), onClick: () => goToDiscover() },
]

const form = useForm({
  initialValues: {
    search: "",
  },
})
const search = refDebounced(toRef(form.values, "search"), 1000)

const {
  data: contacts,
  isError,
  isPending,
  refetch,
} = await useServerQuery("/api/contact", {
  queryKey: queryKeys.contactsSearch(search),
})

function handleGoToChat(username: string) {
  isRootDrawerOpen.value = false
  drawers.newChat = false

  navigateTo(`/app/chat/${username}`)
}
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
      <GenericResource
        :error="isError"
        :loading="isPending"
        @execute="refetch"
      >
        <div class="px-4 pt-3 mb-2">
          <SearchField
            :placeholder="t('Search name or username')"
            path="search"
          />
        </div>

        <ContactItem
          v-for="contact in contacts"
          :key="`contact-${contact.id}`"
          :name="contact.name"
          :description="contact.description"
          @click="handleGoToChat(contact.username)"
        />
      </GenericResource>
    </SettingSection>
  </div>
</template>
