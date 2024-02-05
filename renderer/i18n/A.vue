<script setup lang="ts">
import { SafeProps } from "#framework/utils/types";
import { tv } from "tailwind-variants";
import { computed, useAttrs, type AnchorHTMLAttributes } from "vue";
import useI18n from "./useI18n";
import { localizeHref } from "./utils";

type Props = SafeProps<AnchorHTMLAttributes> & {
  href?: string;
  activeClass?: string;
  localizeHref?: boolean | undefined;
  locale?: string;
};

const props = withDefaults(defineProps<Props>(), {
  localizeHref: undefined,
});
const attrs = useAttrs();
const i18n = useI18n();

const isActive = computed(() => i18n.value.urlWithoutLocale === props.href);

const normalHref = computed(() => {
  return props.localizeHref ?? true
    ? localizeHref(props.href as string, props.locale || i18n.value.locale)
    : (props.href as string);
});

const styles = computed(() =>
  tv({
    base: (attrs.class as string) || "",
    variants: {
      type: {
        active: props.activeClass || "is-active",
        inactive: "",
      },
    },
  })
);
</script>

<template>
  <a
    :class="styles({ type: isActive ? 'active' : 'inactive' })"
    :href="normalHref"
  >
    <slot />
  </a>
</template>
