<script setup lang="ts">
import { useI18n } from "@psitta/vue"
import queryKeys from "~/queryKeys"

const { t } = useI18n()

const modelValue = defineModel<boolean>()

const {
  data: personas,
  isError,
  isPending,
  refetch,
} = await useServerQuery("/api/persona/discover", {
  queryKey: queryKeys.discoverPersonas,
})
</script>

<template>
  <Modal
    v-model="modelValue"
    :confirm-text="t('Close')"
    @confirm="modelValue = false"
  >
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("Personas") }}
      </h1>

      <div class="px-2 pb-2 space-y-2 overflow-y-auto mt-4">
        <Resource
          :error="isError"
          :loading="isPending"
          @execute="refetch"
        >
          <ContactItem
            v-for="persona in personas"
            :key="`persona-${persona.id}`"
            :name="persona.name"
            :description="persona.description"
          />
        </resource>
      </div>
    </template>
  </Modal>
</template>
