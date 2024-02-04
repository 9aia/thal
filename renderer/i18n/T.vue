<script
  setup
  lang="ts"
  generic="T extends string & keyof I18n.MessageSchema, V extends ExtractVariables<T>"
>
import { VNode, createTextVNode, h, useSlots } from "vue";
import { format } from "./format";
import { getConfig, useI18n } from "./index";
import { ExtractVariables } from "./types";
import {
  getDatetimeFormat,
  getMessage,
  getNumberDeclensionRule,
} from "./utils";
import collect from "./collect";

const props = withDefaults(
  defineProps<{
    text: T;
    values?: Partial<V>;
    tag?: string;
  }>(),
  { tag: "span" }
);

type Vars = ExtractVariables<typeof props.text>;
type Context = V & { form?: string };
type Slots = Record<keyof Vars, (c: Context) => string>;

defineSlots<Slots>();

const slots = useSlots();
const i18n = useI18n();

const TextLocalized = () => {
  if (import.meta.env.DEV) {
    collect(props.text, props.values);
  }

  const options = getConfig();

  const locale = i18n.value.locale;
  const values = props.values || {};
  const text = getMessage(props.text, locale, options);
  const numberDeclensionRule = getNumberDeclensionRule(locale, options);
  const datetimeFormat = getDatetimeFormat(locale, options);
  const formatOptions = { numberDeclensionRule, datetimeFormat };

  const children = format<VNode[]>(
    text,
    values,
    ({ prev, part, key, form, dynamic }) => {
      let nodes: VNode[];
      const slot = key && slots[key];

      if (!dynamic || !slot) {
        nodes = [createTextVNode(part)];
      } else {
        const c = { ...values, form };
        nodes = slot(c);
      }

      return [...prev, ...nodes];
    },
    [],
    formatOptions
  );

  const root = h(props.tag, children);
  return root;
};
</script>

<template>
  <TextLocalized />
</template>
