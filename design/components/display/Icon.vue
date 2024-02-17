<script setup lang="ts">
import { useSlotContent } from "#design/composables/useSlotContent";
import { SafeProps } from "#framework/utils/types";
import { type HTMLAttributes } from "vue";

type Props = SafeProps<HTMLAttributes> & {
  name?: string;
};

const props = defineProps<Props>();

const name = useSlotContent(() => props.name);
</script>

<template>
  <span role="img" class="material-symbols-outlined">
    {{ name }}
  </span>
</template>
