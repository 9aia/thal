<script setup lang="ts">
import { RatingGroup } from '@ark-ui/vue'
import type { RuleExpression } from 'vee-validate'
import { useField } from 'vee-validate'
import type { MaybeRef } from 'vue'
import Icon from '../display/Icon.vue'

interface RatingProps {
  path: string
  label: string
  rules?: MaybeRef<RuleExpression<number>>
  icons: RatingIcons[]
}

interface RatingIcons {
  icon: string
  highlightClass: string
}

const props = defineProps<RatingProps>()

const { value, errorMessage } = useField<number>(props.path, props.rules)
</script>

<template>
  <RatingGroup.Root v-model="value" :count="icons.length" class="flex flex-col gap-4">
    <RatingGroup.Label class="text-2xl">
      {{ label }}
    </RatingGroup.Label>

    <RatingGroup.Control v-slot="{ items }" class="flex items-center justify-center">
      <RatingGroup.Item
        v-for="(item, index) in items"
        :key="item"
        v-slot="{ isHighlighted }"
        :index="item"
      >
        <Icon
          :name="icons[index].icon"
          :class="{
            [icons[index].highlightClass]: isHighlighted,
          }"
          class="w-auto h-auto transition-colors !text-6xl sm:!text-8xl md:!text-[128px] cursor-pointer transition-all duration-300"
        />
      </RatingGroup.Item>
    </RatingGroup.Control>

    <slot name="labels" />

    <div>
      <span class="text-red-800 font-bold">{{ errorMessage }}</span>
    </div>
  </RatingGroup.Root>
</template>
