<script lang="ts" setup>
import { usePageContext } from "#framework/composables/usePageContext";

defineProps(["is404"]);

const pageContext = usePageContext();
const message = pageContext.abortReason;
</script>

<template>
  <div v-if="is404" class="flex flex-col items-center justify-center">
    <h1 class="text-5xl font-bold text-orange-500 text-center mb-4">404</h1>
    <p class="text-2xl text-center">
      {{ message || "Não conseguimos encontrar esta página." }}
    </p>

    <a href="/" class="mt-4 btn btn-primary"> Acessar página inicial </a>
  </div>
  <div v-else class="flex flex-col items-center absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2">
    <h1 class="text-5xl font-bold text-red-500 text-center mb-4">500</h1>
    <p class="text-center">Aconteceu algum problema no servidor.</p>

    <a href="/" class="mt-4 btn btn-primary"> Acessar página inicial </a>
  </div>
</template>
