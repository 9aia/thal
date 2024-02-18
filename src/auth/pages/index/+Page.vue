<script setup lang="ts">
import Btn from "#design/components/action/Btn.vue";
import GoogleLogo from "#design/components/display/GoogleLogo.vue";
import { useData } from "#framework/composables/useData";
import Data from "./+data";

const data = useData<typeof Data>();
</script>

<template>
  <div class="mx-auto max-w-lg">
    <h1>Auth</h1>

    <form action="/api/auth/google" method="GET">
      <input
        v-if="data.type"
        type="hidden"
        name="type"
        value="pricing"
      />

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
