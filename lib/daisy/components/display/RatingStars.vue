<script setup lang="ts">
import Icon from '~/lib/daisy/components/display/Icon.vue'

defineProps<{ score: number }>()
</script>

<template>
  <div class="flex gap-1 mb-4 items-center">
    <div class="flex">
      <Icon
        v-for="(_, i) in [0, 1, 2, 3, 4]"
        :key="i"
        name="star"
        :class="{
          'text-orange-500': score > i,
          'text-orange-200': score <= i,
        }"
      />
    </div>
  </div>
</template>
