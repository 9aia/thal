<script setup lang="ts">
import { t } from "@psitta/vue"

import type { MenuItem } from "~~/layers/ui/components/navigation/types"

const emit = defineEmits<{
  (e: "open", emitValue: string): void
  (e: "close"): void
}>()

const generalItems: MenuItem[] = [
  { id: "new-contact", icon: "person_add", name: "New contact" },
  { id: "create-persona", icon: "person_edit", name: "Build persona", emit: "build-persona-drawer" },
]

const discoverItems: MenuItem[] = [
  { id: "discover", icon: "collections_bookmark", name: "Personas" },
]

const contacts: any[] = []
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

  <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-6">
    <SettingSection>
      <MenuGroup
        class="p-0 w-full"
        :items="generalItems"
        @action="emit('open', $event)"
      />
    </SettingSection>

    <SettingSection :title="t('Discover')">
      <MenuGroup class="p-0 w-full" :items="discoverItems" />
    </SettingSection>

    <SettingSection v-if="!!contacts.length" :title="t('Contacts')" />
  </div>
</template>
