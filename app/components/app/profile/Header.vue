<script setup lang="ts">
import { t } from "@psitta/vue"

const emit = defineEmits<{
  (e: "edit"): void
}>()

const user = useUser()
</script>

<template>
  <div
    role="button"
    class="flex justify-between items-start"
    @click="emit('edit')"
  >
    <div class="flex gap-4 items-center">
      <Avatar :name="user!.name" class="w-16 text-xl" />

      <label class="relative" role="button">
        <h2 class="text-lg text-slate-800 font-bold">{{ user!.name }} {{ user!.last_name }}</h2>
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

    <Btn class="btn-circle btn-ghost" @click.prevent>
      <Icon name="edit" class="cursor-pointer" />
    </Btn>
  </div>
</template>
