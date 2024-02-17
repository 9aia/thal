<script setup lang="ts">
import Btn from "#design/components/action/Btn.vue";
import { useToast } from "#design/composables/useToast";
import client from "#framework/client";
import { t } from "#framework/i18n";
import { useForm } from "vee-validate";
import { Ref, inject, ref } from "vue";
import { Profile } from "~/app/profile/schemas/profile";
import { Cookies } from "#framework/utils/cookies";
import TextField from "#design/components/data-input/TextField.vue";

const profile = inject<Ref<Profile>>("profile")!;
const toast = useToast();
const form = useForm<Profile>({
  initialValues: profile?.value,
});

const ERROR_MESSAGE = t("An error occurred while updating personal data.");
const SUCCESS_MESSAGE = t("Personal data has been updated successfully.");
const USERNAME_NOT_FOUND_MESSAGE = t("Username not found.");

const loading = ref(false);

const submit = form.handleSubmit(async () => {
  const username = Cookies.get("username");
  if (!username) {
    throw new Error(USERNAME_NOT_FOUND_MESSAGE);
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
      profile.value[key] = value;
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
      <TextField path="lastName" :label="t('Last name')" class="grid-cols-1/2" />
    </div>
    <TextField path="username" :label="t('Username')" />
    <TextField path="pronouns" :label="t('Pronouns')" />

    <div class="h-2" />

    <Btn :loading="loading" class="btn-primary">{{ t("Save") }}</Btn>
  </form>
</template>
