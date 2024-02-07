<script setup lang="ts">
import Modal from "#design/components/action/Modal.vue";
import Checkbox from "#design/components/data-input/Checkbox.vue";
import Icon from "#design/components/display/Icon.vue";
import { t } from "#framework/i18n";
import { useForm } from "vee-validate";
import { computed, ref } from "vue";
import { Interest } from "../types";
import { INTERESTS, MAX_INTERESTS_AMOUNT, parseInterests } from "../utils";
import { ellipsis } from "#design/utils/text";
import client from "#framework/client";
import { useParams } from "#framework/composables/useParams";
import { useToast } from "#design/composables/useToast";

const props = defineProps<{
  selected: string;
}>();

const parseInitialValues = (selected: string) => {
  return selected.split(", ").reduce<Record<string, boolean>>((acc, key) => {
    acc[key] = true;
    return acc;
  }, {});
};

const initialValues = parseInitialValues(props.selected);
const form = useForm<Record<string, boolean | undefined>>({
  initialValues,
});
const keys = computed(() => {
  const values = form.values;
  return Object.keys(values)
    .filter((key) => values[key])
    .join(", ");
});
const interestNames = computed(() => {
  const interests = parseInterests(keys.value);
  return interests.map((interest) => interest.name);
});

const interests = defineModel<Interest[]>();

const search = ref("");
const filteredList = computed(() => {
  return INTERESTS.filter((interest) =>
    interest.name.toLowerCase().includes(search.value.toLowerCase())
  );
});

const modal = ref<InstanceType<typeof Modal>>();

const open = () => {
  modal.value?.show();
};

const params = useParams();
const toast = useToast();

const ERROR_MESSAGE = t("An error occurred while updating interests.");
const SUCCESS_MESSAGE = t("Interests were updated successfully.");

const confirm = async () => {
  const res = await client.app.profile[":username"].$patch({
    param: {
      username: params.value.username as string,
    },
    json: {
      interests: keys.value,
    },
  });
  if(!res.ok) {
    toast.error(ERROR_MESSAGE)
  } else {
    interests.value = parseInterests(keys.value);
    toast.success(SUCCESS_MESSAGE)
  }
};

defineExpose({
  form,
  open,
});
</script>

<template>
  <Modal ref="modal" :confirm-text="t('Save')" @confirm="confirm">
    <template #default>
      <h3 class="font-bold text-2xl mb-2 mt-4">{{ t("Interests") }}</h3>

      <p class="text-gray-700 mb-4">
        {{
          t(
            "Pick up to {max} interests or sports you enjoy that you want to AI know about you.",
            {
              max: MAX_INTERESTS_AMOUNT,
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

      <form class="h-[200px] overflow-auto">
        <Checkbox
          :path="interest.id"
          :label="interest.name"
          v-for="interest in INTERESTS"
          :class="{
            hidden:
              search && !filteredList.find((o) => o.name === interest.name),
          }"
          :disabled="
            !interestNames.find((name) => name === interest.name) &&
            interestNames.length === MAX_INTERESTS_AMOUNT
          "
        >
          <Icon>{{ interest.icon }}</Icon>
          {{ interest.name }}
        </Checkbox>

        <div class="item error" v-if="search && !filteredList.length">
          <p>{{ t("No results found.") }}</p>
        </div>
      </form>
    </template>

    <template #footer>
      <div class="w-full mr-2">
        <p class="font-bold">
          {{
            t("{selected}/{max} selected", {
              selected: interestNames.length,
              max: MAX_INTERESTS_AMOUNT,
            })
          }}
        </p>

        <small class="text-xs">{{
          ellipsis(interestNames.join(", "), 60)
        }}</small>
      </div>
    </template>
  </Modal>
</template>
