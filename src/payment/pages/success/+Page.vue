<script setup lang="ts">
import { onMounted } from "vue";

onMounted(() => {
  // In production, this should check CSRF, and not pass the session ID.
  // The customer ID for the portal should be pulled from the authenticated user on the server.
  document.addEventListener("DOMContentLoaded", async () => {
    let searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has("session_id")) {
      const session_id = searchParams.get("session_id") as string;
      document.getElementById("session-id")!.setAttribute("value", session_id);
    }
  });
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

    <form action="/create-portal-session" method="POST">
      <input type="hidden" id="session-id" name="session_id" value="" />

      <button id="checkout-and-portal-button" type="submit">
        Manage your billing information
      </button>
    </form>
  </section>
</template>
