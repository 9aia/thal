<script setup lang="ts">
import type Data from './+data'
import Footer from '#lib/daisy/components/layout/Footer.vue'
import Header from '#lib/daisy/components/layout/Header.vue'
import { t } from '#lib/i18n'
import { useData } from '#lib/vike/composables/useData'

const data = useData<typeof Data>()
</script>

<template>
  <Header>
    <template #navbar-end>
      <div class="flex gap-2">
        <a class="btn btn-primary" href="/app/explore">
          {{ t("Try Maratongue") }}
        </a>

        <form action="/api/auth/logout" method="POST">
          <button
            v-if="data.authenticated"
            class="btn"
            type="submit"
          >
            {{ t("Logout") }}
          </button>

          <button
            v-else
            class="btn"
            type="submit"
          >
            {{ t("Sign in") }}
          </button>
        </form>
      </div>
    </template>
  </Header>

  <main class="min-h-screen pt-[64px]">
    <slot />
  </main>

  <Footer />
</template>
