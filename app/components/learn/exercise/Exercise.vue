<script setup lang="ts">
import { useI18n } from "@psitta/vue"
import type { LessonGetDto } from "~/types"

const props = defineProps<{
  lesson: LessonGetDto
}>()
const { t } = useI18n()
const toast = useToast()
const select = defineModel<number | null>()

const components: Record<string, any> = {
  FillInTheBlank: () => import("./types/FillInTheBlank.vue"),
  ReadAndAnswer: () => import("./types/ReadAndAnswer.vue"),
}

const comp = ref<any>()

async function loadComponent(name: string) {
  if (components[name]) {
    try {
      const c = (await components[name]()) as any
      comp.value = markRaw(c.default)
    }
    catch (error) {
      toast.error(t("Error loading exercise"))
    }
  }
}

watch(() => props.lesson, () => {
  loadComponent(props.lesson.exercise!.type)
}, { immediate: true })
</script>

<template>
  <div class="w-full flex flex-col">
    <component
      :is="comp"
      v-if="lesson"
      v-model="select"
      v-bind="props.lesson.exercise!.data"
    />
  </div>
</template>
