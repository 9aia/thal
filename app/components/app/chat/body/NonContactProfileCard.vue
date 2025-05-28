<template>
  <div
    v-if="!hasContact"
    class="bg-gradient-1 mb-8 text-gray-800 text-center sm:max-w-lg mx-auto rounded-3xl"
  >
    <div class="py-8 px-4">
      <Avatar :name="avatarName" class="mx-auto w-20 h-20 text-lg bg-gray-100 text-gray-800" />

      <h2 class="text-gray-900 text-center mb-1">
        {{ displayName }}
      </h2>
      <small class="text-gray-600 text-xs">~ {{ data?.description }}</small>

      <p class="mb-2 text-gray-600 text-sm">
        {{ t('Not a contact') }}
      </p>

      <div class="card-actions justify-center">
        <Button class="bg-cyan-500 border-none rounded-full px-4 py-2 text-gray-800 hover:bg-cyan-400" @click="addContact()">
          <Icon name="material-symbols:person-add-outline" />
          Add
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bg-gradient-1 {
  background: radial-gradient(at top, theme('colors.yellow.50'), theme('colors.gray.50'));
}
</style>
