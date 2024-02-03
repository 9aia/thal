<script setup lang="ts">
import Footer from "#design/components/layout/Footer.vue";
import Header from "#design/components/layout/Header.vue";
import { t } from "#framework/i18n";
import { useData } from "#framework/composables/useData";
import Data from "./+data"

const data = useData<typeof Data>();
</script>

<template>
  <Header>
    <template #navbar-end>
      <div class="flex gap-2">
        <a class="btn btn-primary text-neutral-content" href="/authentication">
          Experimente Maratongue
        </a>

        <form action="/api/auth/logout" method="POST">
          <button class="btn btn-primary text-neutral-content" type="submit" v-if="data.authenticated">
            {{ t("Logout") }}
          </button>

          <button class="btn btn-primary text-neutral-content" type="submit" v-else>
            {{ t("Sign in") }}
          </button>
        </form>
      </div>
    </template>
  </Header>

  <main class="min-h-screen">
    <slot />
  </main>

  <Footer />
</template>
