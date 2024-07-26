<template>
  <Drawer input-id="settings-drawer">
    <template #content>
      <slot />
    </template>

    <template #side>
      <Settings />
    </template>
  </Drawer>
</template>
