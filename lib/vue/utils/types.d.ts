import { VariantProps } from "tailwind-variants";

import { HTMLAttributes } from "vue";

export interface SafeProps<T extends HTMLAttributes> extends /* @vue-ignore */ T {}
export interface SafeVariantProps<T extends VariantProps> extends /* @vue-ignore */ T {}
