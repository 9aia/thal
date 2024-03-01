<script setup lang="ts">
import Icon from '#lib/daisy/components/display/Icon.vue'
import ParentLayout from '../../+Layout.vue'
</script>

<template>
  <ParentLayout class="bg-slate-300">
    <template #nav>
      <div class="flex items-center w-full justify-center mt-4">
        <span>
          English A1
        </span>
        <Icon>keyboard_arrow_down</Icon>
      </div>
    </template>
    <template #default>
      <slot />
    </template>
  </ParentLayout>
</template>
