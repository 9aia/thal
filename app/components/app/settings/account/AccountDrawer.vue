<template>
  <Drawer input-id="account-drawer">
    <template #content>
      <slot />
    </template>

    <template #side>
      <AccountSettings />
    </template>
  </Drawer>
</template>
