<script setup lang="ts">
import { t } from "@psitta/vue"
import { useEventListener } from "@vueuse/core"
import {
  MAX_LESSON,
  NON_SELECTED,
  currentClass,
  exercise,
  select,
} from "~/stores/learn/exercise"

async function generateExercise() {
  const exercise = await $fetch("/api/learn/exercise/generate", {
    method: "POST",
    body: {
      lessonId: "0",
    },
  })

  return exercise
}

async function verifyExercise() {
  const { correct } = await $fetch(`/api/learn/exercise/${exercise.value.id}/verify`, {
    method: "POST",
    body: {
      answer: select.value,
    },
  })

  return correct
}

const finishObj = reactive({
  finished: false,
  correct: false,
  perfectSuccessMessage: t("Congrats"),
})
const nextLesson = ref()
const btn = ref<HTMLButtonElement>()

async function verify() {
  if (!exercise.value)
    return

  finishObj.finished = true
  finishObj.correct = await verifyExercise()

  select.value = NON_SELECTED

  nextLesson.value = await generateExercise()
}

const isSuccess = ref(false)

async function next() {
  if (isSuccess.value) {
    navigateTo("/explore")

    return
  }

  currentClass.currentLesson++

  if (currentClass.currentLesson >= MAX_LESSON) {
    isSuccess.value = true

    select.value = NON_SELECTED
    exercise.value = undefined
    return
  }

  finishObj.finished = false
  exercise.value = nextLesson.value
  nextLesson.value = null
}

onMounted(async () => {
  exercise.value = await generateExercise()

  useEventListener(document, "keydown", (e: any) => {
    if (e.key !== "Enter")
      return

    if (!btn.value)
      return

    if (finishObj.finished) {
      btn.value?.focus()
      btn.value?.click()
      return
    }

    if (select === NON_SELECTED || !exercise)
      return

    btn.value?.focus()
    btn.value?.click()
  })
})
</script>

<template>
  <main class="relative flex flex-col justify-between" style="min-height: calc(100vh)">
    <div>
      <div class="flex gap-2 items-center w-full mb-4 max-w-lg mx-auto pt-4 px-4">
        <A href="/explore" class="flex items-center">
          <Icon>close</Icon>
        </A>
        <progress
          class="progress progress-success w-full"
          :value="Math.floor((100 / MAX_LESSON) * currentClass.currentLesson)" max="100"
        />
      </div>

      <div class="max-w-lg mx-auto pt-4 px-4">
        <ExerciseSuccess v-if="isSuccess" />

        <slot v-else-if="exercise" />

        <template v-else>
          <span class="loading loading-spinner loading-sm absolute bottom-1/2 right-1/2 translate-x-1/2" />
        </template>
      </div>
    </div>

    <div
      class="border-t border-t-gray-400" :class="{
        'bg-green-300': finishObj.correct && finishObj.finished,
        'bg-red-300': !finishObj.correct && finishObj.finished,
      }"
    >
      <div class="flex gap-2 max-w-lg mx-auto p-4">
        <div v-if="!finishObj.finished" class="w-full">
          <Btn
            ref="btn" class="btn-md btn-primary w-full" :disabled="select === NON_SELECTED || !exercise"
            @click="verify"
          >
            Verificar
          </Btn>
        </div>

        <div v-else class="flex w-full items-center justify-between">
          <div v-if="!isSuccess" class="flex gap-2 items-center">
            <div class="p-2 bg-base-100 rounded-full flex items-center justify-center">
              <Icon
                :name="finishObj.correct ? 'check' : 'close'" :class="{
                  'text-green-500': finishObj.correct,
                  'text-red-500': !finishObj.correct,
                }"
              />
            </div>

            <p>
              <template v-if="finishObj.correct">
                Correto!
              </template>

              <template v-else>
                Errado!
              </template>
            </p>
          </div>

          <Btn
            ref="btn"
            class="btn-md btn-neutral float-right"
            :class="{ 'w-full': isSuccess }"
            :loading="!nextLesson"
            :disabled="!nextLesson"
            @click="next"
          >
            Continuar
          </Btn>
        </div>
      </div>
    </div>
  </main>
</template>
