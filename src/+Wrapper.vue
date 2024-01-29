<script setup lang="ts">
import "#design/styles/style.css";
import Toast from "#design/components/feedback/Toast.vue";
import "./i18n";
</script>

<template>
  <Toast />
  <slot />
</template>
