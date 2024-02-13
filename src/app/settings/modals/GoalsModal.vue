<script setup lang="ts">
import Modal from "#design/components/action/Modal.vue";
import Checkbox from "#design/components/data-input/Checkbox.vue";
import Icon from "#design/components/display/Icon.vue";
import { useToast } from "#design/composables/useToast";
import client from "#framework/client";
import { t } from "#framework/i18n";
import { useForm } from "vee-validate";
import { Ref, computed, inject, ref } from "vue";
import { GOALS } from "../../profile/constants";
import { Profile } from "../../profile/schemas/profile";
import { Cookies } from "#framework/utils/cookies";

const parseInitialValues = (selected: string) => {
  return selected.split(", ").reduce<Record<string, boolean>>((acc, key) => {
    if (key === "") return acc;
    acc[key] = true;
    return acc;
  }, {});
};

const toast = useToast();

const profile = inject<Ref<Profile>>("profile")!;

const initialValues = parseInitialValues(profile.value.goals || "");
const form = useForm<Record<string, boolean | undefined>>({
  initialValues,
});
const keys = computed(() => {
  const values = form.values;
  return Object.keys(values)
    .filter((key) => values[key])
    .join(", ");
});

const ERROR_MESSAGE = t("An error occurred while updating goals.");
const SUCCESS_MESSAGE = t("Goals were updated successfully.");
const USERNAME_NOT_FOUND_MESSAGE = t("Username not found.");

const isOpen = defineModel({ default: false });
const loading = ref(false);

const submit = form.handleSubmit(async (data) => {
  const username = Cookies.get("username");
  if (!username) {
    throw new Error(USERNAME_NOT_FOUND_MESSAGE);
  }

  const currentKeys = keys.value;

  loading.value = true;

  const res = await client.app.profile[":username"].$patch({
    param: {
      username,
    },
    json: {
      goals: currentKeys,
    },
  });

  if (!res.ok) {
    toast.error(ERROR_MESSAGE);
  } else {
    profile.value = { ...profile.value, goals: currentKeys };

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
        {{ t("Wry are you learning English?") }}
      </h1>

      <p class="font-gray-600 mb-4">
        {{
          t(
            "Maratongue tailors your learning journey to your unique needs. Tell us what you want to achieve with your English."
          )
        }}
      </p>

      <div class="h-[200px] px-2 overflow-auto">
        <Checkbox :path="goal.id" :label="goal.name" v-for="goal in GOALS">
          <Icon>{{ goal.icon }}</Icon>
          {{ goal.name }}
        </Checkbox>
      </div>
    </template>

    <template #footer>
      <div class="w-full mr-2">
        <p class="font-bold mb-4">
          {{ t("Select all that apply.") }}
        </p>
      </div>
    </template>
  </Modal>
</template>
