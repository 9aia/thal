<script setup lang="ts">
import useSlotContent from "#lib/vue/composables/useSlotContent";
import { SafeProps } from "#lib/vue/utils/types";
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
