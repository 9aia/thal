<script setup lang="ts">
import { A, t } from "#framework/i18n";
import { ref } from "vue";

const v = ref("Hello world!");
</script>

<template>
  <h1>Index</h1>

  <div class="mt-10 p-4">
    <div class="flex gap-1 my-4 pb-2 border-b border-b-gray-500">
      <A href="/" active-class="text-red-500">Home</A>
      <A href="/pricing" active-class="text-red-500">Pricing</A>
      <A locale="pt" href="/pricing" active-class="text-red-500">Preços</A>
    </div>

    <p>{{ t("You have {n} (apple|apples) and {m} (box|boxes)", { m: 1, n: 2 }) }}</p>

    <p>{{ t("Hello, {user}", { user: "Luis" }) }}</p>
  </div>
</template>
