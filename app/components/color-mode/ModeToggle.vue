<script setup lang="ts">
const colorMode = useColorMode()
const { t } = useI18nExperimental()
</script>

<template>
  <UDropdownMenu>
    <UDropdownMenuTrigger as-child>
      <UButton variant="ghost">
        <Icon name="material-symbols:dark-mode-rounded" class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <Icon name="material-symbols:light-mode-rounded" class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span class="sr-only">
          {{ t("Toggle theme") }}
        </span>
      </UButton>
    </UDropdownMenuTrigger>
    <UDropdownMenuContent align="end">
      <UDropdownMenuItem @click="colorMode.preference = 'light'">
        {{ t("Light") }}
      </UDropdownMenuItem>
      <UDropdownMenuItem @click="colorMode.preference = 'dark'">
        {{ t("Dark") }}
      </UDropdownMenuItem>
      <UDropdownMenuItem @click="colorMode.preference = 'system'">
        {{ t("System") }}
      </UDropdownMenuItem>
    </UDropdownMenuContent>
  </UDropdownMenu>
</template>
