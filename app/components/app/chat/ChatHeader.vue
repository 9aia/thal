<script lang="ts" setup>
import { t } from "@psitta/vue"
import { rightDrawer, rightDrawers } from "~/store"
import type { MenuItem } from "~~/layers/ui/components/navigation/types"

defineProps<{
  name: string
  username: string
}>()

const items: MenuItem[] = [
  {
    id: "view-contact",
    name: t("View contact"),
    icon: "person",
    onClick: () => openContactView(),
  },
]

function openContactView() {
  // profileModal.open(props.username as string)
  rightDrawer.value = true
  rightDrawers.contactView = true
}
</script>

<template>
  <header class="px-3 py-2 bg-slate-800 flex gap-2">
    <label for="my-drawer" class="lg:hidden btn btn-ghost btn-circle text-primary drawer-button">
      <Icon name="arrow_back" />
    </label>

    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar" @click="openContactView()">
      <div class="w-10 rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        >
      </div>
    </div>

    <div class="flex-1 flex items-center justify-between gap-4">
      <div tabindex="0" role="button" class="block text-primary w-full" @click="openContactView()">
        {{ name }}
      </div>

      <div>
        <div class="dropdown dropdown-end">
          <button class="btn btn-circle btn-ghost text-primary" @click="updateRedirectUrl">
            <Icon>more_vert</Icon>
          </button>

          <Menu :items="items" />
        </div>
      </div>
    </div>
  </header>
</template>
