<template>
  <Drawer input-id="build-persona-drawer">
    <template #content>
      <slot />
    </template>

    <template #side>
      <BuildPersona />
    </template>
  </Drawer>
</template>
