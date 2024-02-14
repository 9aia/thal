<script setup lang="ts">
import { t } from '#framework/i18n';
</script>

<template>
  <div class="">
    <div class="container mx-auto py-12">
      <h2 class="text-3xl font-semibold text-center mb-6">
        {{ t("Choose your plan") }}
      </h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          class="bg-white p-6 border border-teal-500 rounded-md shadow-md flex flex-col justify-between"
        >
          <div>
            <h3 class="text-lg font-semibold mb-4">Plano Premium</h3>
            <p class="text-gray-600 mb-4">Advanced learning experience</p>

            <div class="flex items-center justify-center mb-6">
              <span class="text-4xl font-semibold text-primary">R$29.99</span>
              <span class="text-gray-500 ml-1">/mês</span>
            </div>

            <ul class="text-gray-600 list-disc ml-4">
              <li>Teste de Inglês</li>
              <li>Explicações interativas</li>
              <li>Exercícios personalizados ilimitados</li>
              <li>Histórias geradas com perguntas de compreensão</li>
              <li>Conversas de simulação da vida real</li>
              <li>Sem anúncios</li>
              <li>Acesso antecipado a novas funcionalidades</li>
              <li>Dê feedback antecipado</li>
            </ul>
          </div>

          <form action="/api/payment/stripe/create-checkout-session" method="GET">
            <button
              id="checkout-and-portal-button"
              type="submit"
              class="block mt-6 w-full bg-teal-500 text-white py-2 text-center rounded-md hover:bg-teal-600"
            >
              Escolher Premium
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add your custom styles here */
</style>
