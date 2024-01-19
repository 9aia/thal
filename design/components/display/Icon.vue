<script setup lang="ts">
import { cnBase, tv } from "tailwind-variants";
import { useAttrs, type HTMLAttributes } from "vue";
import { useSlotContent } from "#design/composables/useSlotContent";
import { SafeProps } from "#framework/utils/types";

const styles = tv({
  base: "material-symbols-outlined shrink-0 w-6 h-6",
});

type Props = SafeProps<HTMLAttributes> & {
  name?: string;
};

const props = defineProps<Props>();

const name = useSlotContent(() => props.name);
const attrs = useAttrs();
</script>

<template>
  <span
    role="img"
    :class="styles({ class: cnBase(name, attrs.class as any) })"
    >{{ name }}</span
  >
</template>
