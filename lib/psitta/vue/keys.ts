import type { InjectionKey, Ref } from 'vue'

export const localeKey = Symbol('Locale') as InjectionKey<Readonly<Ref<string>>>
