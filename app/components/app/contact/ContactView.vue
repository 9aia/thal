<script setup lang="ts">
import { t } from "@psitta/vue"
import { useQuery } from "@tanstack/vue-query"
import { contactData, drawers, rightDrawer, rightDrawers } from "~/store"
import queryKeys from "~/queryKeys"
import type { MenuItem } from "~~/layers/ui/components/navigation/types"

const contactDeleteModalState = ref(false)

const route = useRoute()
const username = computed(() => route.params.username as string)

const {
  data,
  isLoading,
  isError,
} = useQuery({
  queryKey: queryKeys.contactInfo(username),
  queryFn: () => {
    return $fetch(`/api/contact-info/${username.value}`, {
      method: "GET",
    })
  },
})

const hasContact = computed(() => !!data.value?.contact)

function handleAddContact() {
  if (!data.value)
    return

  drawers.newContact = true
  contactData.value = {
    name: data.value.name!,
    username: data.value.username!,
  }
}

const items = computed<MenuItem[]>(() => [
  hasContact.value
    ? {
        id: "delete-contact",
        name: t("Delete Contact"),
        icon: "delete",
        onClick: () => {
          contactDeleteModalState.value = true
        },
      }
    : {
        id: "add-contact",
        name: t("Add Contact"),
        icon: "add",
        onClick: () => {
          handleAddContact()
        },
      },
])

function closeDrawer() {
  rightDrawer.value = false
  rightDrawers.contactView = false
}
</script>

<template>
  <div class="flex flex-col h-full w-96 bg-white">
    <ContactDeleteModal v-model="contactDeleteModalState" :contact-username="username" />

    <header class="px-3 py-2 flex gap-2">
      <h1 class="text-md py-2 text-slate-800 flex items-center gap-1">
        <Btn size="md" class="btn-ghost btn-circle" @click="closeDrawer">
          <Icon name="close" />
        </Btn>
        {{ t("Contact Info") }}
      </h1>

      <div class="flex-1 flex items-center justify-end gap-4">
        <div>
          <div class="dropdown dropdown-end">
            <Btn size="md" class="btn-ghost btn-circle" @click="updateRedirectUrl">
              <Icon name="more_vert" />
            </Btn>

            <Menu :items="items" />
          </div>
        </div>
      </div>
    </header>

    <Resource :loading="isLoading" :error="isError">
      <div class="bg-white flex flex-1 flex-col items-center p-4">
        <div tabindex="0" role="button" class="mx-auto w-24 h-24 btn btn-ghost btn-circle avatar">
          <div class="w-24 rounded-full">
            <img
              alt="Tailwind CSS Navbar component"
              src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
            >
          </div>
        </div>

        <h2 class="text-slate-900 text-center text-2xl mb-1">
          {{ data?.name }}
        </h2>
        <small class="text-slate-600 text-xs mb-4">@{{ data?.username }}</small>

        <p class="text-slate-600 text-xs mt">
          {{ data?.description }}
        </p>
      </div>
    </Resource>
  </div>
</template>
