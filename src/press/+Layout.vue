<script setup lang="ts">
import Footer from '#lib/daisy/components/layout/Footer.vue'
import Header from '#lib/daisy/components/layout/Header.vue'
import { t } from '#lib/i18n'
import A from '#lib/vike/components/A.vue'
import { usePageContext } from '#lib/vike/composables/usePageContext'

const c = usePageContext()
</script>

<template>
  <Header>
    <template #navbar-end>
      <div class="flex gap-2">
        <a class="btn btn-primary" href="/app/explore">
          {{ t("Try Maratongue") }}
        </a>

        <div>
          <form
            v-if="!!c.user"
            action="/api/auth/logout"
            method="post"
          >
            <button
              class="btn"
              type="submit"
            >
              {{ t("Logout") }}
            </button>
          </form>

          <A
            v-else
            class="btn"
            href="/authentication"
          >
            {{ t("Sign in") }}
          </A>
        </div>
      </div>
    </template>
  </Header>

  <main class="min-h-screen pt-[64px]">
    <slot />
  </main>

  <Footer />
</template>
