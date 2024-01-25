<script setup lang="ts">
import { useSearchParams } from "#framework/composables/useSearchParams";
import { onMounted, ref } from "vue";

const searchParams = useSearchParams();

const sessionIdRef = ref<HTMLInputElement>()

onMounted(() => {
  const sessionId = searchParams.value["session_id"]

  sessionIdRef.value!.value = sessionId
});
</script>

<template>
  <h1>Success</h1>

  <section>
    <div class="product Box-root">
      <span class="hidden"> Product Image </span>

      <div class="description Box-root">
        <h3>Subscription to Starter plan successful!</h3>
      </div>
    </div>

    <form action="/api/payment/stripe/create-portal-session" method="POST">
      <input
        ref="sessionIdRef"
        type="hidden"
        name="session_id"
      />

      <button id="checkout-and-portal-button" type="submit">
        Manage your billing information
      </button>
    </form>
  </section>
</template>
