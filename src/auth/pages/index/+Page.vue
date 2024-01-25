<script setup lang="ts">
import Btn from "#design/components/action/Btn.vue";
import GoogleLogo from "#design/components/display/GoogleLogo.vue";
</script>

<template>
  <div class="mx-auto max-w-lg">
    <h1>Auth</h1>

    <form action="/api/auth/google" method="GET">
      <Btn
        type="submit"
        class="btn mt-2 w-full flex gap-1"
      >
        <GoogleLogo />
        Continuar com Google
      </Btn>
    </form>
  </div>
</template>
