<template>
  <Drawer input-id="new-chat-drawer">
    <template #content>
      <Home />
    </template>

    <template #side>
      <slot />
    </template>
  </Drawer>
</template>
