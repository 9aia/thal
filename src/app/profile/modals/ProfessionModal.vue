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
import { MAX_PROFESSION_CHARS } from "../constants";

const profile = inject<Ref<Profile>>("profile")!;

const params = useParams();
const toast = useToast();
const form = useForm<Profile>({
  initialValues: profile?.value,
});

const ERROR_MESSAGE = t("An error occurred while updating your profession.");
const SUCCESS_MESSAGE = t("Profession has been updated successfully.");
const INVALID_PROFESSION_CHAR_AMOUNT = t(`It must contain at most ${MAX_PROFESSION_CHARS} characters`);

const isOpen = defineModel({ default: false });
const loading = ref(false);

const submit = form.handleSubmit(async (data) => {
  loading.value = true;

  const res = await client.app.profile[":username"].$patch({
    param: {
      username: params.value.username as string,
    },
    json: form.values,
  });

  if (!res.ok) {
    toast.error(ERROR_MESSAGE);
  } else {
    profile.value = { ...profile.value, profession: data.profession };

    toast.success(SUCCESS_MESSAGE);
  }

  loading.value = false;
  isOpen.value = false;
});
</script>

<template>
  <Modal
    :confirm-text="t('Save')"
    @confirm="submit"
    v-model="isOpen"
    :loading="loading"
  >
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("What do you do for work?") }}
      </h1>

      <p class="text-md text-gray-500">
        {{ t("Tell us what you do (or aspire to do). Example: Teacher.") }}
      </p>

      <div class="px-2 pb-2 space-y-2 overflow-y-auto mt-4">
        <TextField
          path="profession"
          :label="t('Your profession')"
          :rules="
            (v) =>
              v.length <= MAX_PROFESSION_CHARS || INVALID_PROFESSION_CHAR_AMOUNT
          "
          :feedback="true"
        >
          <template #feedback>
            <span
              :class="{
                'text-red-500':
                  form.values.profession.length > MAX_PROFESSION_CHARS,
              }"
            >
              {{ form.values.profession.length }}/{{ MAX_PROFESSION_CHARS }}
              characters
            </span>
          </template>
        </TextField>
      </div>

      <p class="text-md text-gray-600">
        {{
          t(
            "P.S. Don't have a traditional job? No worries! Share your life's calling - writer, musician, world traveler - anything goes!"
          )
        }}
      </p>
    </template>
  </Modal>
</template>
