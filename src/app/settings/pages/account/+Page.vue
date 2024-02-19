<script setup lang="ts">
import Btn from "#design/components/action/Btn.vue";
import { useToast } from "#design/composables/useToast";
import client from "#framework/client";
import { t } from "#framework/i18n";
import { useForm } from "vee-validate";
import { inject, ref, toValue, watch } from "vue";
import { Profile } from "~/app/profile/schemas/profile";
import { Cookies } from "#framework/utils/cookies";
import TextField from "#design/components/data-input/TextField.vue";
import Icon from "#design/components/display/Icon.vue";
import { useDebounceFn } from "@vueuse/core";
import { yupUsername } from "../../../profile/schemas/profile";

const ERROR_MESSAGE = t("An error occurred while updating personal data.");
const SUCCESS_MESSAGE = t("Personal data has been updated successfully.");
const USERNAME_NOT_FOUND_MESSAGE = t("Username not found.");
const USERNAME_INVALID_MESSAGE = t("Username is invalid.");
const USERNAME_VALIDATION_ERROR_MESSAGE = t(
  "An error occurred while validating username."
);

const profile = inject<Profile>("profile")!;
const toast = useToast();
const form = useForm<Profile>({
  initialValues: toValue(profile),
});

const loading = ref(false);

const invalidUsername = ref(true);

const validateUsername = async (username: string) => {
  if (!username) return;

  const res = await client.app.profile.validateUsername[":username"].$get({
    param: {
      username,
    },
  });

  let valid = false;

  if (!res.ok) {
    toast.error(USERNAME_VALIDATION_ERROR_MESSAGE);
  } else {
    const result = await res.json();
    valid = result.valid;
  }

  invalidUsername.value = !valid;

  form.setFieldError("username", !valid ? USERNAME_INVALID_MESSAGE : undefined);
};

const debouncedValidateUsername = useDebounceFn(validateUsername, 500);
watch(() => form.values.username, debouncedValidateUsername);

const submit = form.handleSubmit(async (data) => {
  if (!data.username || invalidUsername.value) return;

  const username = Cookies.get("username");
  if (!username) {
    throw new Error(USERNAME_NOT_FOUND_MESSAGE);
  }

  if (username !== data.username) {
    Cookies.set("username", data.username, { path: "/" });
  }

  loading.value = true;

  const res = await client.app.profile[":username"].$patch({
    param: {
      username: username as string,
    },
    json: form.values,
  });

  if (!res.ok) {
    toast.error(ERROR_MESSAGE);
  } else {
    Object.keys(form.values).forEach((key) => {
      // @ts-ignore
      const value = form.values[key];
      // @ts-ignore
      profile[key] = value;
    });

    toast.success(SUCCESS_MESSAGE);
  }

  loading.value = false;
});
</script>

<template>
  <h1 class="text-4xl font-bold mb-4">{{ t("Account Settings") }}</h1>

  <form @submit="submit" class="block space-y-2">
    <div class="gap-2 grid grid-cols-2">
      <TextField path="name" :label="t('Name')" class="grid-cols-1/2" />
      <TextField
        path="lastName"
        :label="t('Last name')"
        class="grid-cols-1/2"
      />
    </div>
    <TextField
      path="username"
      :label="t('Username')"
      :rules="v => yupUsername(v) || USERNAME_INVALID_MESSAGE"
      iconPosition="right"
    >
      <template #icon="{ errorMessage }">
        <Icon
          :class="{ 'text-error': errorMessage, 'text-success': !errorMessage }"
          :name="errorMessage ? 'close' : 'check'"
        />
      </template>
    </TextField>
    <TextField path="pronouns" :label="t('Pronouns')" />

    <div class="h-2" />

    <Btn :loading="loading" class="btn-primary">{{ t("Save") }}</Btn>
  </form>
</template>
