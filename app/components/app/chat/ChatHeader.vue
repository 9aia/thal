<script lang="ts" setup>
defineProps<{
  name: string
}>()

const user = useUser()
const profileModal = useProfileModal()
</script>

<template>
  <header class="px-3 py-2 bg-slate-800 flex gap-2">
    <label for="my-drawer" class="lg:hidden btn btn-ghost btn-circle text-primary drawer-button">
      <Icon name="arrow_back" />
    </label>

    <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar" @click="profileModal.open(user!.username)">
      <div class="w-10 rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
        >
      </div>
    </div>

    <div class="flex-1 flex items-center">
      <div class="block text-primary">
        {{ name }}
      </div>
    </div>
  </header>
</template>
