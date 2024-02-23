<script setup lang="ts">
import { markRaw, onMounted, ref, watch } from 'vue'
import { exercise, select } from '../../store'
import { useToast } from '#lib/daisy/composables/useToast'
import { useI18n } from '#lib/i18n'

const { t } = useI18n()
const components = import.meta.glob('../../exercises/*.vue')

const toast = useToast()
const comp = ref<any>()

async function loadExercise(name: string) {
  const path = `../../exercises/${name}.vue`

  if (components[path]) {
    try {
      const c = (await components[path]()) as any
      comp.value = markRaw(c.default)
    }
    catch (error) {
      toast.error(t('Error loading exercise'))
    }
  }
}

onMounted(() => {
  loadExercise(exercise.value.type)
})

watch(exercise, () => {
  loadExercise(exercise.value.type)
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
