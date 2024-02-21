<script setup lang="ts">
import { markRaw, onMounted, ref, watch } from 'vue'
import { exercise, select } from '../../store'
import { useToast } from '#lib/daisy/composables/useToast'
import { t } from '#lib/i18n'

const LOAD_ERROR_MESSAGE = t('Error loading exercise')

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
      toast.error(LOAD_ERROR_MESSAGE)
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
