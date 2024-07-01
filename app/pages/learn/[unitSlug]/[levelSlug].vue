<script setup lang="ts">
import { useI18n } from "@psitta/vue"
import { useQueryClient } from "@tanstack/vue-query"
import { useAsyncState, useEventListener } from "@vueuse/core"
import Exercise from "~/components/learn/exercise/Exercise.vue"
import type { LessonGetDto } from "~/types"
import { getMaxExerciseAmount, getMaxLessonAmount } from "~/utils/learn/exercise"
import { getLevelConfig, getLevelImplementation } from "~/utils/learn/level"

definePageMeta({
  middleware: "premium",
  layout: false,
})

const { t } = useI18n()
const route = useRoute()
const toast = useToast()

const sectionSlug = ref("a1")
const unitSlug = route.params.unitSlug as string
const levelSlug = route.params.levelSlug as string

const level = computed(() => {
  return getLevelConfig("a1", unitSlug, levelSlug)
})

const levelImplementation = computed(() => {
  if (!level.value)
    return null

  return getLevelImplementation(level.value)
})

const btn = ref<HTMLButtonElement>()
const NON_SELECTED = null
const select = ref(NON_SELECTED)

const exerciseStore = reactive({
  finished: false,
  correct: false,
})

const lesson = ref<LessonGetDto>({
  lessonIndex: 0,
  lastExercisePosition: 0,
  exercise: null,
})
const nextLessonState = ref()

const maxLessonAmount = computed(() => {
  return getMaxLessonAmount(sectionSlug.value, unitSlug, levelSlug) || 0
})
const maxExerciseAmount = computed(() => {
  return getMaxExerciseAmount(sectionSlug.value, unitSlug, levelSlug) || 0
})

const isLessonCompleted = computed(() => lesson.value.lastExercisePosition >= maxExerciseAmount.value)
const isLevelCompleted = computed(() => lesson.value.lessonIndex >= maxLessonAmount.value)

async function getLessonState() {
  return await $fetch("/api/learn/exercise/prepare", {
    method: "POST",
    body: {
      unitSlug,
      levelSlug,
    },
  })
}

const { isLoading: isLessonLoading, error, execute } = useAsyncState(getLessonState, undefined, {
  onSuccess(data) {
    if (!data)
      return

    lesson.value = data
  },
})

async function getNextExercise() {
  return await $fetch(`/api/learn/exercise/${lesson.value.exercise?.id}/next`, {
    method: "POST",
    body: {
      answer: select.value,
      unitSlug,
      levelSlug,
      lessonIndex: lesson.value.lessonIndex,
    },
  })
}

const nextExercise = useAsyncState(getNextExercise, null, {
  immediate: false,
  onSuccess() {
    nextLessonState.value = nextExercise.state.value?.nextLessonState
    exerciseStore.correct = !!nextExercise.state.value?.correct

    exerciseStore.finished = true
    select.value = NON_SELECTED
  },
  onError() {
    toast.error(t("Failed to proceed to the next exercise. Try again."))
  },
})

async function continueLesson() {
  if (isLessonCompleted.value) {
    navigateTo("/explore")

    return
  }

  lesson.value = nextLessonState.value

  if (isLessonCompleted.value)
    select.value = NON_SELECTED

  exerciseStore.finished = false
  nextLessonState.value = null
}

async function getNextLesson() {
  return await $fetch("/api/learn/lesson/next", {
    method: "POST",
    body: {
      unitSlug,
      levelSlug,
    },
  })
}

const queryClient = useQueryClient()

const nextLesson = useAsyncState(getNextLesson, undefined, {
  immediate: false,
  onSuccess(data) {
    if (!data)
      return

    lesson.value = data

    queryClient.invalidateQueries({
      queryKey: ["/learn/section", sectionSlug.value],
    })
  },
  onError() {
    toast.error(t("Failed to proceed to the next lesson. Try again."))
  },
})

/* async function nextLevel() {
  console.log("nextLevel")
} */

onMounted(async () => {
  useEventListener(document, "keydown", (e: any) => {
    if (e.key !== "Enter")
      return

    if (!btn.value)
      return

    if (exerciseStore.finished) {
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
</script>

<template>
  <main class="relative flex flex-col justify-between" style="min-height: calc(100vh)">
    <Resource :loading="isLessonLoading" :error="!!error" @execute="execute">
      <div>
        <div class="flex gap-2 items-center w-full mb-4 max-w-lg mx-auto pt-4 px-4">
          <A href="/explore" class="flex items-center">
            <Icon>close</Icon>
          </A>
          <progress
            class="progress progress-success w-full"
            :value="Math.floor((100 / maxExerciseAmount) * lesson.lastExercisePosition)" max="100"
          />
        </div>

        <div class="max-w-lg mx-auto pt-4 px-4">
          <LevelCompleted
            v-if="isLevelCompleted" :loading="false"
            :already-completed="lesson.lastExercisePosition === 0" @finish="nextLesson.execute()"
          />

          <ExerciseCompleted
            v-else-if="isLessonCompleted" :loading="nextLesson.isLoading.value"
            @next-lesson="nextLesson.execute()"
          />

          <Exercise v-else-if="lesson.exercise" v-model="select" :lesson="lesson" />

          <template v-else>
            <span class="loading loading-spinner loading-sm absolute bottom-1/2 right-1/2 translate-x-1/2" />
          </template>
        </div>
      </div>

      <div
        class="border-t border-t-gray-400" :class="{
          'bg-green-300': exerciseStore.correct && exerciseStore.finished,
          'bg-red-300': !exerciseStore.correct && exerciseStore.finished,
        }"
      >
        <div class="flex gap-2 max-w-lg mx-auto p-4">
          <div v-if="!exerciseStore.finished" class="w-full">
            <Btn
              ref="btn" class="btn-md btn-primary w-full"
              :disabled="levelImplementation?.selectable ? select === NON_SELECTED || nextExercise.isLoading.value : false"
              :loading="nextExercise.isLoading.value" @click="nextExercise.execute()"
            >
              {{ !levelImplementation?.selectable ? t('Continue') : t('Verify') }}
            </Btn>
          </div>

          <div v-else class="flex w-full items-center justify-between">
            <div v-if="!isLessonCompleted" class="flex gap-2 items-center">
              <div class="p-2 bg-base-100 rounded-full flex items-center justify-center">
                <Icon
                  :name="exerciseStore.correct ? 'check' : 'close'" :class="{
                    'text-green-500': exerciseStore.correct,
                    'text-red-500': !exerciseStore.correct,
                  }"
                />
              </div>

              <p>
                <template v-if="exerciseStore.correct">
                  {{ t('Correct!') }}
                </template>

                <template v-else>
                  {{ t('Wrong!') }}
                </template>
              </p>
            </div>

            <Btn
              ref="btn" class="btn-md btn-neutral float-right" :class="{ 'w-full': isLessonCompleted }"
              :loading="nextExercise.isLoading.value" :disabled="nextExercise.isLoading.value" @click="continueLesson"
            >
              {{ t('Continue') }}
            </Btn>
          </div>
        </div>
      </div>
    </Resource>
  </main>
</template>
