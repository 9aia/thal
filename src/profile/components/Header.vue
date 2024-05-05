<script setup lang="ts">
import { t } from "@psitta/vue"
import type { User } from "lucia"

const user = inject<Ref<User>>("profile")!
</script>

<template>
  <div class="sm:shadow-lg pb-4 sm:p-4 bg-base-100 rounded-lg flex gap-4 items-center">
    <Avatar :name="user!.name" class="w-24 text-3xl" />

    <label class="relative cursor-pointer">
      <h2 class="text-lg text-slate-800 font-bold">{{ user!.name }}</h2>
      <div class="text-sm flex gap-3">
        <div>@{{ user!.username }}</div>
        <div v-if="user!.pronouns">{{ user!.pronouns }}</div>
      </div>

      <small class="text-gray-600">
        {{
          t("Joined {signupDate}", {
            signupDate: [
              new Date(user!.createdAt),
              {
                year: "numeric",
                month: "long",
              },
            ],
          })
        }}
      </small>
    </label>
  </div>
</template>
