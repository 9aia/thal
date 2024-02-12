<script setup lang="ts">
import Modal from "#design/components/action/Modal.vue";
import Textarea from "#design/components/data-input/Textarea.vue";
import { useToast } from "#design/composables/useToast";
import client from "#framework/client";
import { useParams } from "#framework/composables/useParams";
import { t } from "#framework/i18n";
import { useForm } from "vee-validate";
import { Ref, inject, ref } from "vue";
import { MAX_OBSERVATION_CHARS } from "../constants";
import { Profile } from "../schemas/profile";

const profile = inject<Ref<Profile>>("profile")!;

const params = useParams();
const toast = useToast();
const form = useForm<Profile>({
  initialValues: profile?.value,
});

const ERROR_MESSAGE = t("An error occurred while updating your observation.");
const SUCCESS_MESSAGE = t("Observation has been updated successfully.");
const INVALID_OBSERVATION_CHAR_AMOUNT = t(`It must contain at most ${MAX_OBSERVATION_CHARS} characters`);

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
    profile.value = { ...profile.value, observation: data.observation };

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
        {{ t("What else would like to share with AI?") }}
      </h1>

      <div class="px-2 pb-2 space-y-2 overflow-y-auto mt-4">
        <Textarea
          class="resize-none"
          path="observation"
          :label="t('Your observation')"
          :rules="
            (v) =>
              v?.length <= MAX_OBSERVATION_CHARS || INVALID_OBSERVATION_CHAR_AMOUNT
          "
          :feedback="true"
        >
          <template #feedback>
            <span
              :class="{
                'text-red-500':
                  form.values.observation?.length > MAX_OBSERVATION_CHARS,
              }"
            >
              {{ form.values.observation?.length || 0 }}/{{ MAX_OBSERVATION_CHARS }}
              characters
            </span>
          </template>
        </Textarea>
      </div>
    </template>
  </Modal>
</template>
