<script setup lang="ts">
import { LEFT_SIDEBAR_PROVIDE_KEY } from '~/constants/sidebar'

const sidebar = useSidebar(LEFT_SIDEBAR_PROVIDE_KEY)
</script>

<template>
  <CharacterBuilder
    @back="sidebar.back()"
  />
</template>
