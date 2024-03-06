<script setup lang="ts">
import { t } from '~/lib/psitta/vue'
import Header from '~/src/ui/components/layout/Header.vue'
import Footer from '~/src/ui/components/layout/Footer.vue'

const user = useUser()
const logout = useLogout()
</script>

<template>
  <div class="text-center bg-teal-500 text-slate-800 py-2 px-4">
    We're currently undergoing active development!
  </div>

  <Header>
    <template #navbar-end>
      <div class="flex items-center gap-2">
        <div>
          <form v-if="!!user" action="/api/logout" method="post" @submit.prevent="logout">
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
            href="/sign-in"
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