<script lang="ts" setup>
import { usePageContext } from "#framework/composables/usePageContext";
import { computed } from "vue";

const pageContext = usePageContext();

const errorMessage = computed(() => {
  const makeReturn = (message: string, statusCode: number) => {
    return {
      color: statusCode === 404 ? 'text-orange-500' : 'text-red-500',
      statusCode,
      message,
    }
  }

  const options: Record<number, string> = {
    403: 'Você não tem permissão para acessar esta página.',
    404: 'Não conseguimos encontrar esta página.',
    410: 'Esta página foi removida.',
    429: 'Você está fazendo muitas requisições.',
    500: 'Aconteceu algum problema no servidor.',
    401: 'Você não está logado.',
    503: 'O servidor está em manutenção.',
  }

  const statusCode = pageContext.is404
    ? 404
    : (options.hasOwnProperty(pageContext.abortStatusCode || '')
      ? pageContext.abortStatusCode
      : 500);

  const message = pageContext.abortReason
    || (options.hasOwnProperty(statusCode!)
      ? options[statusCode!]
      : options[500]);

  if (typeof message === 'object') {
    if (message.notAdmin) {
      return makeReturn(options[403], 403)
    }

    return makeReturn(options[500], 500)
  }

  return makeReturn(message, statusCode!)
})
</script>

<template>
  <div class="flex flex-col items-center absolute right-1/2 translate-x-1/2 bottom-1/2 translate-y-1/2">
    <h1 class="text-5xl font-bold text-center mb-4" :class="errorMessage.color">
      {{ errorMessage.statusCode }}
    </h1>
    <p class="text-center">{{ errorMessage.message }}</p>

    <a href="/" class="mt-4 btn btn-primary"> Acessar página inicial </a>
  </div>
</template>
