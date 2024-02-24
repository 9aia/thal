<script setup lang="ts">
import { navigate } from 'vike/client/router'
import { onMounted, reactive, ref } from 'vue'
import { useEventListener } from '@vueuse/core'
import {
  MAX_LESSON,
  NON_SELECTED,
  currentClass,
  exercise,
  select,
} from '../../store'
import Btn from '#lib/daisy/components/action/Btn.vue'
import Icon from '#lib/daisy/components/display/Icon.vue'
import client from '#lib/hono/client'
import { Cookies } from '#lib/web/utils/cookies'
import { t } from '#lib/i18n'

async function generateExercise() {
  const username = Cookies.get('username')
  if (!username)
    return

  const res = await client.exercise.generate.$post({
    json: {
      username,
      lessonId: 0,
    },
  })
  const result = await res.json()

  return result
}

async function verifyExercise() {
  const res = await client.exercise.verify[':id'].$post({
    param: {
      id: exercise.value.id,
    },
    json: {
      answer: select.value,
    },
  })
  const result = await res.json()

  return result.correct
}

const finishObj = reactive({
  finished: false,
  correct: false,
  perfectSuccessMessage: t('Congrats'),
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

async function next() {
  currentClass.currentLesson++

  if (currentClass.currentLesson >= MAX_LESSON) {
    navigate('/app/play/lesson/completed', { overwriteLastHistoryEntry: true })
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

  useEventListener(document, 'keydown', (e: any) => {
    if (e.key !== 'Enter')
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
  <main
    class="relative flex flex-col justify-between"
    style="min-height: calc(100vh)"
  >
    <div>
      <div
        class="flex gap-2 items-center w-full mb-4 max-w-lg mx-auto pt-4 px-4"
      >
        <a href="/app/explore" class="flex items-center">
          <Icon>close</Icon>
        </a>
        <progress
          class="progress progress-success w-full"
          :value="Math.floor((100 / MAX_LESSON) * currentClass.currentLesson)"
          max="100"
        />
      </div>

      <div class="max-w-lg mx-auto pt-4 px-4">
        <slot v-if="exercise" />
        <template v-else>
          <span
            class="loading loading-spinner loading-sm absolute bottom-1/2 right-1/2 translate-x-1/2"
          />
        </template>
      </div>
    </div>

    <div
      v-if="exercise"
      class="border-t border-t-gray-400"
      :class="{
        'bg-green-300': finishObj.correct && finishObj.finished,
        'bg-red-300': !finishObj.correct && finishObj.finished,
      }"
    >
      <div class="flex gap-2 max-w-lg mx-auto p-4">
        <div v-if="!finishObj.finished" class="w-full">
          <Btn
            v-model="btn"
            class="btn-md btn-primary w-full"
            :disabled="select === NON_SELECTED || !exercise"
            @click="verify"
          >
            Verificar
          </Btn>
        </div>

        <div v-else class="flex w-full items-center justify-between">
          <div class="flex gap-2 items-center">
            <div
              class="p-2 bg-base-100 rounded-full flex items-center justify-center"
            >
              <Icon
                :name="finishObj.correct ? 'check' : 'close'"
                :class="{
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
            v-model="btn"
            class="btn-md btn-neutral float-right"
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
