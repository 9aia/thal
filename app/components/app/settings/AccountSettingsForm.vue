<script setup lang="ts">
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { useForm } from 'vee-validate'
import type { MenuItemType } from '~/components/ui/navigation/types'
import queryKeys from '~/queryKeys'
import type { User } from '~~/db/schema'
import { userLastNameSchema, userLastNameSchemaChecks, userNameSchema, userNameSchemaChecks, usernameSchema, usernameSchemaChecks } from '~~/db/schema'

const { t } = useI18nExperimental()
const toast = useToast()
const user = useUser()
const logout = useLogout()
const queryClient = useQueryClient()

const form = useForm<User>({
  initialValues: toValue(user),
})
useUsernameValidation(form)
const hasErrors = useHasFormErrors(form)

const isDeactivateModalOpen = ref(false)

const editAccountMutation = useMutation({
  mutationFn: async ({ username, formData }: { username: string, formData: User }) => {
    return await $fetch(`/api/profile/${username}`, {
      method: 'patch',
      body: formData,
    })
  },
  onError: () => {
    toast.error(t('An error occurred while updating personal data.'))
  },
  onSuccess(data) {
    const updatedUser: User = { ...user.value!, ...data }

    user.value = updatedUser

    toast.success(t('Personal data has been updated successfully.'))

    queryClient.invalidateQueries({
      queryKey: queryKeys.profile(updatedUser.username),
    })
  },
})

const submit = form.handleSubmit(async (data) => {
  const username = user.value!.username!

  editAccountMutation.mutate({
    username,
    formData: data,
  })
})

const items = computed<MenuItemType[]>(() => [
  {
    id: 'manage-billing',
    icon: 'material-symbols:subscriptions-outline-rounded',
    action: '/api/payment/stripe/create-portal-session',
    method: 'post',
    name: t('Manage billing information'),
  },
  {
    id: 'logout',
    icon: 'material-symbols:logout-rounded',
    name: t('Logout'),
    meaning: 'warning',
    onClick: () => { logout() },
  },
  {
    id: 'deactivate',
    icon: 'material-symbols:account-circle-off-outline-rounded',
    name: t('Deactivate account'),
    type: 'accordion',
    meaning: 'danger',
    onClick: () => { isDeactivateModalOpen.value = true },
  },
])
</script>

<template>
  <SettingSection
    :title="t('General Information')"
    title-class="px-6"
    body-class="px-4"
  >
    <form class="px-2 flex flex-col gap-2 items-end" @submit="submit">
      <TextField
        path="name"
        :label="t('Name')"
        class="w-full"
        input-class="input-lg input-primary w-full"
        :rules="yupify(userNameSchema, t(
          `Name must contain between {min} and {max} characters.`,
          userNameSchemaChecks,
        ))"
      />
      <TextField
        path="lastName"
        :label="t('Last name')"
        class="w-full"
        input-class="input-lg input-primary w-full"
        :rules="yupify(userLastNameSchema, t(
          `Last name must contain between {min} and {max} characters.`,
          userLastNameSchemaChecks,
        ))"
      />

      <TextField
        path="username"
        autocapitalize="none"
        autocomplete="off"
        :label="t('Username')"
        class="w-full"
        :rules="yupify(usernameSchema, t(
          'Username can only contain letters, numbers, and underscores. Min {min} character, max {max} characters.',
          usernameSchemaChecks,
        ))"
        input-class="input-lg input-primary w-full"
        icon-position="right"
      >
        <template #icon="{ errorMessage }">
          <Icon
            :class="{ 'text-error': errorMessage, 'text-success': !errorMessage }"
            :name="errorMessage ? 'material-symbols:close-rounded' : 'material-symbols:check-rounded'"
          />
        </template>
      </TextField>

      <!-- TODO: Move pronouns to the profile page -> About me -->
      <!-- <TextField
        path="pronouns"
        :label="t('Pronouns')"
        class="w-full"
        input-class="input-lg input-primary w-full"
        :rules="yupify(pronounsSchema, t(
          'Pronouns must be up to {max} characters long.',
          pronounsSchemaChecks,
        ))"
      /> -->

      <Button
        :loading="editAccountMutation.isPending.value"
        class="btn btn-primary mt-2 mb-4"
        icon="material-symbols:save-outline-rounded"
        :disabled="hasErrors"
      >
        {{ t('Save account settings') }}
      </Button>
    </form>

    <AccountFeatureList class="mt-4 px-2" />
  </SettingSection>

  <SettingSection
    :title="t('Actions')"
    title-class="px-6"
    body-class="px-4"
  >
    <ItemList :items="items" />

    <AccountDeactivateModal v-model="isDeactivateModalOpen" />
  </SettingSection>
</template>
