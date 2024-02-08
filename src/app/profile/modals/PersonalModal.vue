<script setup lang="ts">
import Modal from "#design/components/action/Modal.vue";
import TextField from "#design/components/data-input/TextField.vue";
import { useToast } from "#design/composables/useToast";
import client from "#framework/client";
import { useParams } from "#framework/composables/useParams";
import { t } from "#framework/i18n";
import { useForm } from "vee-validate";
import { Ref, inject, ref } from "vue";
import { Profile } from "../schemas/profile";

const profile = inject<Ref<Profile>>("profile");

const params = useParams();
const toast = useToast();
const form = useForm<Profile>({
  initialValues: profile?.value,
});

const modal = ref<InstanceType<typeof Modal>>();

const open = () => {
  modal.value?.show();
};

const ERROR_MESSAGE = t("An error occurred while updating personal data.");
const SUCCESS_MESSAGE = t("Personal data has been updated successfully.");

const confirm = async () => {
  const res = await client.app.profile[":username"].$patch({
    param: {
      username: params.value.username as string,
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
};

defineExpose({
  open,
});
</script>

<template>
  <Modal ref="modal" :confirm-text="t('Save')" @confirm="confirm">
    <template #default>
      <h3 class="font-bold text-2xl mb-2 mt-4">{{ t("Personal Data") }}</h3>

      <form class="h-[200px] px-2 pb-2 space-y-2 overflow-y-auto">
        <TextField path="name" :label="t('Name')" />
        <TextField path="lastName" :label="t('Last name')" />
        <TextField path="username" :label="t('Username')" />
        <TextField path="pronouns" :label="t('Pronouns')" />
      </form>
    </template>
  </Modal>
</template>
