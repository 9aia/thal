<script setup lang="ts">
import { useI18n } from "@psitta/vue"
import { exercise, select } from "~/stores/learn/exercise"

const { t } = useI18n()

const components: Record<string, any> = {
  "../../../../../components/learn/exercise/FillInTheBlank.vue": () => import("../../../../../components/learn/exercise/FillInTheBlank.vue"),
  "../../../../../components/learn/exercise/ReadAndAnswer.vue": () => import("../../../../../components/learn/exercise/ReadAndAnswer.vue"),
}

const toast = useToast()
const comp = ref<any>()

async function loadExercise(name: string) {
  const path = `../../../../../components/learn/exercise/${name}.vue`

  if (components[path]) {
    try {
      const c = (await components[path]()) as any
      comp.value = markRaw(c.default)
    }
    catch (error) {
      toast.error(t("Error loading exercise"))
    }
  }
}

onMounted(() => {
  loadExercise(exercise.value.type)
})

watch(exercise, () => {
  loadExercise(exercise.value.type)
})

definePageMeta({
  layout: "exercise",
})
</script>

<template>
  <div class="w-full flex flex-col">
    <component
      :is="comp"
      v-if="exercise"
      v-model="select"
      v-bind="exercise?.data"
    />
  </div>
</template>
