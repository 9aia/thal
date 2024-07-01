<script setup lang="ts">
import { t } from "@psitta/vue"
import type { ExerciseConcept } from "~/types"

defineProps<ExerciseConcept>()
</script>

<template>
  <h1 class="text-2xl font-bold mb-4">
    {{ t("Concept:") }}
  </h1>

  <p class="text-xl mb-4">
    {{ text }}
  </p>

  <div>
    {{ example }}
  </div>
</template>
