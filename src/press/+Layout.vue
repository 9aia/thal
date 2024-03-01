<script setup lang="ts">
import Footer from '#lib/daisy/components/layout/Footer.vue'
import Header from '#lib/daisy/components/layout/Header.vue'
import { t } from '#lib/i18n'
import A from '#lib/vike/components/A.vue'
import { usePageContext } from '#lib/vike/composables/usePageContext'

const c = usePageContext()
</script>

<template>
  <div class="text-center bg-teal-500 text-slate-800 py-2 px-4">
    We're currently undergoing active development!
  </div>

  <Header>
    <template #navbar-end>
      <div class="flex items-center gap-2">
        <div>
          <form
            v-if="!!c.user"
            action="/api/auth/logout"
            method="post"
          >
            <button
              class="link"
              type="submit"
            >
              {{ t("Logout") }}
            </button>
          </form>

          <A
            v-else
            class="link"
            href="/authentication"
          >
            {{ t("Sign in") }}
          </A>
        </div>
      </div>
    </template>
  </Header>

  <main>
    <slot />
  </main>

  <Footer />
</template>
