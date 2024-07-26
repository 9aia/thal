<template>
  <Drawer input-id="profile-drawer">
    <template #content>
      <slot />
    </template>

    <template #side>
      <ProfileSettings />
    </template>
  </Drawer>
</template>
