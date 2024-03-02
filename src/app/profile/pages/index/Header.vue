<script setup lang="ts">
import useProfile from '../../store'
import Avatar from '#lib/daisy/components/display/Avatar.vue'
import { t } from '#lib/i18n'

const user = useProfile()
</script>

<template>
  <div class="sm:shadow-lg pb-4 sm:p-4 bg-base-100 rounded-lg flex gap-4 items-center">
    <Avatar :name="user.name" class="w-24 text-3xl" />

    <label class="relative cursor-pointer">
      <h2 class="text-lg text-slate-800 font-bold">{{ user.name }}</h2>
      <div class="text-sm flex gap-3">
        <div>@{{ user.username }}</div>
        <div v-if="user.pronouns">{{ user.pronouns }}</div>
      </div>

      <small class="text-gray-600">
        {{
          t("Joined {signupDate}", {
            signupDate: {
              date: new Date(user.signupDate),
              year: "numeric",
              month: "long",
            },
          })
        }}
      </small>
    </label>
  </div>
</template>
