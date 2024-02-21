<script setup lang="ts">
import useProfile from '../../store'
import Avatar from '#lib/daisy/components/display/Avatar.vue'
import { t } from '#lib/i18n'

const profile = useProfile()
</script>

<template>
  <div class="sm:shadow-lg pb-4 sm:p-4 bg-base-100 rounded-lg flex gap-4 items-center">
    <Avatar :name="profile.name" class="w-24 text-3xl" />

    <label class="relative cursor-pointer">
      <h2 class="text-lg font-bold">{{ profile.name }}</h2>
      <div class="text-sm flex gap-3">
        <div>@{{ profile.username }}</div>
        <div v-if="profile.pronouns">{{ profile.pronouns }}</div>
      </div>

      <small class="text-gray-600">
        {{
          t("Joined {signupDate}", {
            signupDate: {
              date: new Date(profile.signupDate),
              year: "numeric",
              month: "long",
            },
          })
        }}
      </small>
    </label>
  </div>
</template>
