<script setup lang="ts">
import Toast from "#design/components/feedback/Toast.vue";
import "#design/styles/style.css";
import Translate from "#framework/i18n/components/Translate.vue";
import "./i18n";
</script>

<template>
  <Toast />
  <slot />

  <Translate />
</template>
