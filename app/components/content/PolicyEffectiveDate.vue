<script setup>
import { v } from '@psitta/vue'

const config = useRuntimeConfig()

const date = v(new Date(config.public.POLICY_EFFECTIVE_DATE_TIMESTAMP))
</script>

<template>
  <slot />{{ date }}
</template>
