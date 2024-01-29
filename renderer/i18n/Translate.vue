<script
  setup
  lang="ts"
  generic="T extends keyof I18n.MessageSchema, V extends ExtractVariables<T>"
>
import { computed } from "vue";
import t from "./t";
import { ExtractVariables } from "./types";

const props = defineProps<{
  text: T;
  values?: Partial<V>;
}>();

const textLocalized = computed(() => t(props.text));
</script>

<template>
  {{ textLocalized }}
</template>
