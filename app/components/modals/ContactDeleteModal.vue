<script setup lang="ts">
import { T, useI18n } from "@psitta/vue"
import { useMutation, useQueryClient } from "@tanstack/vue-query"
import { useFieldError, useFieldValue, useForm } from "vee-validate"
import queryKeys from "~/queryKeys"

const props = defineProps<{
  contactUsername: string
}>()

const { t } = useI18n()

const isOpen = defineModel({ default: false })

const { handleSubmit, resetForm } = useForm()

const queryClient = useQueryClient()

const {
  mutate,
} = useMutation({
  mutationFn: async () => {
    return $fetch(`/api/contact/${props.contactUsername}` as "/api/contact/:username", {
      method: "DELETE",
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: queryKeys.contacts,
    })

    queryClient.invalidateQueries({
      queryKey: queryKeys.chat(props.contactUsername),
    })

    isOpen.value = false
  },
})

const submit = handleSubmit(async () => {
  mutate()
})

watch(isOpen, () => {
  if (!isOpen.value)
    return

  resetForm()
})

function checkUsernameRule(inputValue: string) {
  if (!inputValue)
    return t("Username is required")

  return inputValue === props.contactUsername || t("Username does not match")
}

const isFieldError = useFieldError("username")
const inputValue = useFieldValue("username")

const isUsernameInvalid = computed(() => {
  return !(!isFieldError.value && !!inputValue.value)
})
</script>

<template>
  <Modal v-model="isOpen">
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("Are you sure?") }}
      </h1>

      <div role="alert" class="flex items-center gap-2 bg-transparent">
        <Icon class="text-warning">
          warning
        </Icon>

        <T
          text="This action {cannot} be undone. This will permanently delete the contact."
          :values="{ cannot: 'cannot' }"
        >
          <template #cannot="slotProps">
            <span class="font-bold">
              {{ slotProps.cannot }} {{ ' ' }}
            </span>
          </template>
        </T>
      </div>

      <p class="mb-4 mt-4 text-slate-800" />

      <p class="mb-2 text-slate-800">
        <T text="To confirm, please insert {username} below:" :values="{ username: true }">
          <template #username>
            <span class="text-warning font-bold">
              {{ contactUsername }} {{ ' ' }}
            </span>
          </template>
        </T>
      </p>

      <TextField label="Username" path="username" :rules="checkUsernameRule" />
    </template>

    <template #actions>
      <Btn value="true" class="btn-error" :disabled="isUsernameInvalid" @click.prevent="submit">
        {{ t('Delete contact') }}
      </Btn>

      <Btn value="false" class="btn btn-primary" @click="isOpen = false">
        {{ t('Cancel') }}
      </Btn>
    </template>
  </Modal>
</template>
