<script setup lang="ts">
import { useAsyncState, useEventListener } from "@vueuse/core"
import Exercise from "~/components/learn/exercise/Exercise.vue"
import { MAX_EXERCISE_AMOUNT } from "~/constants/exercises"
import type { LessonGetDto } from "~/types"

const route = useRoute()

const lesson = ref<LessonGetDto>({
  lessonAmount: 0,
  currentExercise: 0,
  exercise: null,
})

async function getLessonState() {
  return await $fetch("/api/learn/exercise/prepare", {
    method: "POST",
    body: {
      unitSlug: route.params.unitSlug,
      levelSlug: route.params.levelSlug,
      lessonAmount: lesson.value.lessonAmount,
    },
  })
}

const isSuccess = computed(() => lesson.value.currentExercise >= MAX_EXERCISE_AMOUNT)

const { isLoading: isFirstLoading } = useAsyncState(getLessonState, undefined, {
  onSuccess(data) {
    if (!data)
      return

    lesson.value = data
  },
})

const nextLessonState = ref()

const NON_SELECTED = null
const select = ref(NON_SELECTED)

const finishObj = reactive({
  finished: false,
  correct: false,
})
const btn = ref<HTMLButtonElement>()

async function getVerify() {
  return await $fetch(`/api/learn/exercise/${lesson.value.exercise?.id}/next`, {
    method: "POST",
    body: {
      answer: select.value,
      unitSlug: route.params.unitSlug,
      levelSlug: route.params.levelSlug,
      lessonAmount: lesson.value.lessonAmount,
    },
  })
}

const fetchVerify = useAsyncState(getVerify, null, {
  immediate: false,
})

async function verify() {
  await fetchVerify.execute()

  nextLessonState.value = fetchVerify.state.value?.nextLessonState
  finishObj.correct = !!fetchVerify.state.value?.correct

  finishObj.finished = true
  select.value = NON_SELECTED
}

async function next() {
  if (isSuccess.value) {
    navigateTo("/explore")

    return
  }

  lesson.value = nextLessonState.value

  if (isSuccess.value)
    select.value = NON_SELECTED

  finishObj.finished = false
  nextLessonState.value = null
}

async function nextLesson() {
  console.log("a")
}

onMounted(async () => {
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

    if (select.value === NON_SELECTED || !lesson.value.exercise)
      return

    btn.value?.focus()
    btn.value?.click()
  })
})

definePageMeta({
  middleware: "premium",
  layout: false,
})
</script>

<template>
  <main v-if="isFirstLoading" class="relative flex flex-col justify-between" style="min-height: calc(100vh)">
    <span class="loading loading-spinner loading-sm absolute bottom-1/2 right-1/2 translate-x-1/2" />
  </main>

  <main v-else class="relative flex flex-col justify-between" style="min-height: calc(100vh)">
    <div>
      {{ lesson.lessonAmount }}
      <div class="flex gap-2 items-center w-full mb-4 max-w-lg mx-auto pt-4 px-4">
        <A href="/explore" class="flex items-center">
          <Icon>close</Icon>
        </A>
        <progress
          class="progress progress-success w-full"
          :value="Math.floor((100 / MAX_EXERCISE_AMOUNT) * lesson.currentExercise)" max="100"
        />
      </div>

      <div class="max-w-lg mx-auto pt-4 px-4">
        <ExerciseCompleted v-if="isSuccess" @next-lesson="nextLesson" />

        <Exercise
          v-else-if="lesson.exercise"
          v-model="select"
          :lesson="lesson"
        />

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
            ref="btn"
            class="btn-md btn-primary w-full"
            :disabled="select === NON_SELECTED || fetchVerify.isLoading.value"
            :loading="fetchVerify.isLoading.value"
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
            :loading="!nextLessonState"
            :disabled="!nextLessonState"
            @click="next"
          >
            Continuar
          </Btn>
        </div>
      </div>
    </div>
  </main>
</template>
