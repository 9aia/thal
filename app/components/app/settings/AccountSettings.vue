<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'
import { useForm } from 'vee-validate'
import { useI18n } from '@psitta/vue'
import { useQueryClient } from '@tanstack/vue-query'
import type { User } from '~~/db/schema'
import { nameSchema, pronounsSchema, usernameSchema } from '~~/db/schema'
import type { MenuItem } from '~/components/ui/navigation/types'
import queryKeys from '~/queryKeys'

const emit = defineEmits<{
  (e: 'close'): void
}>()
const { t } = useI18n()
const toast = useToast()

const user = useUser()
const form = useForm<User>({
  initialValues: toValue(user),
})
const hasErrors = useHasFormErrors(form)
const invalidUsername = ref(false)
const loading = ref(false)

const queryClient = useQueryClient()

const isDeleteModalOpen = ref(false)

async function validateUsername(username: string) {
  if (!username)
    return

  const currentUsername = user.value!.username

  let invalid = false

  try {
    const { valid } = await $fetch(`/api/user/validate-username/${username}`)

    invalid = !valid && currentUsername !== username
  }
  catch (e) {
    const _ = e

    toast.error(t(
      'An error occurred while validating username.',
    ))
    invalid = false
  }

  invalidUsername.value = invalid

  form.setFieldError(
    'username',
    invalid ? t('Username is invalid.') : undefined,
  )
}

const debouncedValidateUsername = useDebounceFn(validateUsername, 500)
watch(() => form.values.username, debouncedValidateUsername)

const submit = form.handleSubmit(async (data) => {
  const username = user.value!.username

  loading.value = true

  try {
    await $fetch(`/api/profile/${username}`, {
      method: 'patch',
      body: data,
    })

    const updatedUser = { ...user.value!, ...data }

    user.value = updatedUser

    toast.success(t('Personal data has been updated successfully.'))

    queryClient.invalidateQueries({
      queryKey: queryKeys.profile(updatedUser.username),
    })
  }
  catch (e) {
    const _ = e
    toast.error(t('An error occurred while updating personal data.'))
  }

  loading.value = false
})

const dangerItems: MenuItem[] = [
  {
    id: 'delete',
    icon: 'delete',
    name: t('Delete account'),
    description: t('This action is irreversible.'),
    type: 'accordion',
    onClick: () => {
      isDeleteModalOpen.value = true
    },
  },
]

const logout = useLogout()
</script>

<template>
  <div class="flex flex-col h-dvh justify-between">
    <Navbar>
      <h1 class="text-lg py-2 text-primary font-bold flex items-center gap-1">
        <Button size="sm" class="btn-ghost btn-circle" @click="emit('close')">
          <Icon name="arrow_back" />
        </Button>
        {{ t("Account") }}
      </h1>
    </Navbar>

    <div class="px-4 py-4 flex-1 overflow-y-auto bg-white space-y-4">
      <SettingSection :title="t('General Information')">
        <form class="block space-y-2" @submit="submit">
          <div class="gap-2 grid grid-cols-2">
            <TextField
              path="name" :label="t('Name')" class="grid-cols-1/2" :rules="yupify(nameSchema, t(
                'Name must contain between 1 and 20 characters.',
              ))"
            />
            <TextField
              path="lastName" :label="t('Last name')" class="grid-cols-1/2" :rules="yupify(nameSchema, t(
                'Last name must contain between 1 and 20 characters.',
              ))"
            />
          </div>
          <TextField
            path="username" :label="t('Username')" :rules="yupify(usernameSchema, t('Username is invalid.'))"
            icon-position="right"
          >
            <template #icon="{ errorMessage }">
              <Icon
                :class="{ 'text-error': errorMessage, 'text-success': !errorMessage }"
                :name="errorMessage ? 'close' : 'check'"
              />
            </template>
          </TextField>
          <TextField
            path="pronouns" :label="t('Pronouns')" :rules="yupify(pronounsSchema, t(
              'Pronouns must be up to 20 characters long.',
            ))"
          />

          <div class="h-2" />

          <Button :loading="loading" class="btn-primary" :disabled="hasErrors">
            {{
              t("Save")
            }}
          </Button>
        </form>

        <ul class="mt-6">
          <li class="flex gap-2 items-center">
            <Icon class="text-success">
              check
            </Icon>

            <span class="text-sm text-slate-800">{{ t('Signed in with Google') }}</span>
          </li>

          <li class="flex gap-2 items-center">
            <Icon class="text-success">
              check
            </Icon>

            <span class="text-sm text-slate-800">{{ t('Connected with Stripe') }}</span>
          </li>
        </ul>
      </SettingSection>

      <button class="underline font-bold text-warning mt-2" @click="logout">
        {{ t("Logout") }}
      </button>

      <SettingSection :title="t('Danger zone')" class="pt-4" title-class="text-error">
        <template #header>
          <hr class="border-b-2 border-error">
        </template>
        <template #default>
          <MenuGroup
            class="p-0 w-full shadow-none"
            item-class="py-2"
            :items="dangerItems"
          />

          <ClientOnly>
            <AccountDeleteModal v-model="isDeleteModalOpen" />
          </ClientOnly>
        </template>
      </SettingSection>
    </div>
  </div>
</template>
