<script setup lang="ts">
import Modal from "#design/components/action/Modal.vue";
import Checkbox from "#design/components/data-input/Checkbox.vue";
import Icon from "#design/components/display/Icon.vue";
import { useToast } from "#design/composables/useToast";
import { ellipsis } from "#design/utils/text";
import client from "#framework/client";
import { useParams } from "#framework/composables/useParams";
import { t } from "#framework/i18n";
import { useForm } from "vee-validate";
import { Ref, computed, inject, ref } from "vue";
import { Profile } from "../schemas/profile";
import { parseJoin } from "../utils";
import { HOBBIES, MAX_HOBBIES_AMOUNT } from "../constants";

const parseInitialValues = (selected: string) => {
  return selected.split(", ").reduce<Record<string, boolean>>((acc, key) => {
    if (key === "") return acc;
    acc[key] = true;
    return acc;
  }, {});
};

const params = useParams();
const toast = useToast();

const profile = inject<Ref<Profile>>("profile")!;

const initialValues = parseInitialValues(profile.value.hobbies || "");
const form = useForm<Record<string, boolean | undefined>>({
  initialValues,
});
const keys = computed(() => {
  const values = form.values;
  return Object.keys(values)
    .filter((key) => values[key])
    .join(", ");
});
const hobbyNames = computed(() => {
  const hobbies = parseJoin(keys.value, HOBBIES);
  return hobbies.map((hobby) => hobby.name);
});

const search = ref("");
const filteredList = computed(() => {
  return HOBBIES.filter((hobby) =>
    hobby.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const ERROR_MESSAGE = t("An error occurred while updating hobbies.");
const SUCCESS_MESSAGE = t("Hobbies were updated successfully.");

const isOpen = defineModel({ default: false });
const loading = ref(false);

const submit = form.handleSubmit(async (data) => {
  const currentKeys = keys.value;
  
  loading.value = true;

  const res = await client.app.profile[":username"].$patch({
    param: {
      username: params.value.username as string,
    },
    json: {
      hobbies: currentKeys,
    },
  });

  if (!res.ok) {
    toast.error(ERROR_MESSAGE);
  } else {
    profile.value = { ...profile.value, hobbies: currentKeys };

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
      <h1 class="font-bold text-2xl mb-2 mt-4">{{ t("Hobbies") }}</h1>

      <p class="text-gray-700 mb-4">
        {{
          t(
            "Pick up to {max} hobbies or sports you enjoy that you want to AI know about you.",
            {
              max: MAX_HOBBIES_AMOUNT,
            }
          )
        }}
      </p>

      <div class="form-control">
        <input
          type="text"
          placeholder="Search"
          class="input input-bordered w-auto mb-4"
          v-model="search"
        />
      </div>

      <div class="h-[200px] px-2 overflow-auto">
        <Checkbox
          :path="hobby.id"
          :label="hobby.name"
          v-for="hobby in HOBBIES"
          :class="{
            hidden: search && !filteredList.find((o) => o.name === hobby.name),
          }"
          :disabled="
            !hobbyNames.find((name) => name === hobby.name) &&
            hobbyNames.length === MAX_HOBBIES_AMOUNT
          "
        >
          <Icon>{{ hobby.icon }}</Icon>
          {{ hobby.name }}
        </Checkbox>

        <div class="item error" v-if="search && !filteredList.length">
          <p>{{ t("No results found.") }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="w-full mr-2">
        <p class="font-bold">
          {{
            t("{selected}/{max} selected", {
              selected: hobbyNames.length,
              max: MAX_HOBBIES_AMOUNT,
            })
          }}
        </p>

        <small class="text-xs">{{ ellipsis(hobbyNames.join(", "), 60) }}</small>
      </div>
    </template>
  </Modal>
</template>
