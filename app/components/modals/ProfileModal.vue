<script setup lang="ts">
// TODO delete this file
import { useQuery } from "@tanstack/vue-query"
import { useI18n } from "@psitta/vue"
import { drawers } from "~/store"
import queryKeys from "~/queryKeys"

const props = defineProps<{
  username: string | null
}>()

const modelValue = defineModel({ default: false })

const { t } = useI18n()

const user = useUser()
const isMe = computed(() => user.value!.username === props.username)

const {
  data,
  isLoading,
  refetch,
  isError,
  error,
} = useQuery({
  queryKey: queryKeys.profile(computed(() => props.username!)),
  queryFn: async () => {
    if (!props.username)
      throw new Error("Username is required")

    if (isMe.value)
      return user.value
    else
      return $fetch(`/api/profile/${props.username}`)
  },
  enabled: computed(() => (isMe.value || !!props.username) && modelValue.value),
})

function goToEdit() {
  modelValue.value = false
  drawers.profileSettings = true
}

provide("profile", data)
</script>

<template>
  <Modal
    v-model="modelValue"
    :hide-confirm="true"
    :show-close-button="true"
    classes="min-h-[600px] max-h-[600px]"
  >
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("Profile") }}
      </h1>

      <div v-if="isLoading || (!data && !isError)" class="flex justify-center items-center h-[450px]">
        <Spinner size="sm" />
      </div>

      <div
        v-else-if="isError"
        class="flex justify-center items-center h-[450px]"
      >
        <Error
          :error="error"
          @try-again="refetch"
        >
          <template #title="{ isNotFound, isForbidden }">
            <div class="space-y-2">
              <div>
                <div v-if="isNotFound">
                  {{ t("User not found:") }}
                </div>

                <div v-else-if="isForbidden">
                  {{ t("Forbidden for user: ") }}
                </div>

                <div v-else>
                  {{ t("Something wrong happened") }}
                </div>
              </div>

              <div class="text-white text-sm">
                <div v-if="isNotFound || isForbidden">
                  {{ username }}
                </div>
              </div>
            </div>
          </template>

          <template #action="{ tryAgainFn, isForbidden, isNotFound }">
            <Btn
              v-if="!isNotFound && !isForbidden"
              class="btn-primary"
              @click="tryAgainFn()"
            >
              <Icon name="mdi-refresh" />
              {{ t('Try again') }}
            </Btn>

            <Btn
              v-else
              class="btn-primary"
              @click="drawers.profile = true"
            >
              <Icon name="mdi-refresh" />
              {{ t('Go to my profile') }}
            </Btn>
          </template>
        </Error>
      </div>

      <div
        v-else
        class="bg-slate-300 flex flex-col h-full overflow-auto"
      >
        <aside class="w-full">
          <Header @edit="goToEdit" />
        </aside>

        <main class="w-full space-y-4">
          <AboutMe />
          <Goals />
          <Interests />
          <Observation />
        </main>
      </div>
    </template>
  </Modal>
</template>
