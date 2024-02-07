<script setup lang="ts">
import { A, t } from "#framework/i18n";
</script>

<template>
  
  <div class="p-4">
    <h1>Index</h1>

    <div class="flex gap-1 my-4 pb-2 border-b border-b-gray-500">
      <A href="/" active-class="text-red-500">Home</A>
      <A href="/pricing" active-class="text-red-500">Pricing</A>
      <A locale="pt" href="/pricing" active-class="text-red-500">Preços</A>
    </div>
    <br />

    {{
      t("Hello {date} (numeric)", {
        date: new Date(),
      })
    }}
  </div>
</template>
