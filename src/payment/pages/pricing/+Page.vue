<template>
  <div class="">
    <div class="container mx-auto py-12">
      <h2 class="text-3xl font-semibold text-center mb-6">Escolha seu plano</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div
          class="bg-white border border-green-500 p-6 rounded-md shadow-md flex flex-col justify-between"
        >
          <div class="">
            <h3 class="text-lg font-semibold mb-4">Plano Básico</h3>
            <p class="text-gray-600 mb-4">Experimente de graça</p>

            <div class="flex items-center justify-center mb-6">
              <span class="text-4xl font-semibold text-green-500">Grátis</span>
            </div>

            <ul class="text-gray-600 list-disc ml-4">
              <li>Teste de Inglês</li>
              <li>3 lições</li>
              <li>3 explicações</li>
              <li>1 história com questões de compreensão</li>
            </ul>
          </div>

          <form action="/create-checkout-session" method="POST">
            <!-- Add a hidden field with the lookup_key of your Price -->
            <input
              type="hidden"
              name="lookup_key"
              value="{{PRICE_LOOKUP_KEY}}"
            />
            <button
              id="checkout-and-portal-button"
              type="submit"
              class="mt-6 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              Escolher Básico
            </button>
          </form>
        </div>

        <div
          class="bg-white p-6 border border-purple-500 rounded-md shadow-md flex-col justify-between"
        >
          <div>
            <h3 class="text-lg font-semibold mb-4">Plano Padrão</h3>
            <p class="text-gray-600 mb-4">For intermediate learners</p>

            <div class="flex items-center justify-center mb-6">
              <span class="text-4xl font-semibold text-purple-500"
                >R$19.99</span
              >
              <span class="text-gray-500 ml-1">/mês</span>
            </div>

            <ul class="text-gray-600 list-disc ml-4">
              <li>Explicações interativas</li>
              <li>Exercícios personalizados ilimitados</li>
              <li>Histórias geradas com perguntas de compreensão</li>
              <li>Conversas de simulação da vida real</li>
              <li>Sem anúncios</li>
              <!-- <li>Desafios de gramática</li>
              <li>Relatórios semanais de progresso</li>
              <li>Exercícios básicos de vocabulário</li> -->
            </ul>
          </div>

          <form action="/create-checkout-session" method="POST">
            <!-- Add a hidden field with the lookup_key of your Price -->
            <input
              type="hidden"
              name="lookup_key"
              value="{{PRICE_LOOKUP_KEY}}"
            />
            <button
              id="checkout-and-portal-button"
              type="submit"
              class="block mt-6 w-full bg-purple-500 text-white py-2 text-center rounded-md hover:bg-purple-600"
            >
              Escolher Padrão
            </button>
          </form>
        </div>

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
              <li>Tudo no Plano Padrão</li>
              <li>Acesso antecipado a novas funcionalidades</li>
              <li>Dê feedback antecipado</li>
            </ul>
          </div>

          <form action="/create-checkout-session" method="POST">
            <!-- Add a hidden field with the lookup_key of your Price -->
            <input
              type="hidden"
              name="lookup_key"
              value="{{PRICE_LOOKUP_KEY}}"
            />
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

<script>
export default {
  name: "PricingPage",
  // Add your data, methods, etc. here
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
