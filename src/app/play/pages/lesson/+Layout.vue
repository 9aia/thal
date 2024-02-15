<script setup lang="ts">
import Btn from "#design/components/action/Btn.vue";
import Icon from "#design/components/display/Icon.vue";
import { navigate } from "vike/client/router";
import { onMounted, reactive, ref } from "vue";
import {
  MAX_LESSON,
  NON_SELECTED,
  currentClass,
  data,
  implementation,
  select,
} from "../../store";
import { useListener } from "#design/composables/useListener";
import client from "#framework/client";

async function generateLesson() {
  const res = await client.lesson.$get();
  const result = await res.json();

  return result;
}

const finishObj = reactive({
  finished: false,
  correct: false,
  perfectSuccessMessage: "Bom trabalho!",
});
const nextLesson = ref();
const btn = ref<HTMLButtonElement>();

const verify = async () => {
  if (!data.value) return;

  finishObj.finished = true;

  if (implementation.value?.verify(data.value.obj, select.value)) {
    finishObj.correct = true;
  } else {
    finishObj.correct = false;
  }

  select.value = NON_SELECTED;

  nextLesson.value = await generateLesson();
};

const next = async () => {
  currentClass.currentLesson++;

  if (currentClass.currentLesson >= MAX_LESSON) {
    navigate("/app/play/lesson/completed", { overwriteLastHistoryEntry: true });
    select.value = NON_SELECTED;
    data.value = undefined;
    return;
  }

  finishObj.finished = false;
  data.value = nextLesson.value;
  nextLesson.value = null;
};

onMounted(async () => {
  data.value = await generateLesson();
});

useListener("keydown", (e: any) => {
  if (e.key !== "Enter") return;

  if (!btn.value) return;

  if (finishObj.finished) {
    btn.value?.focus();
    btn.value?.click();
    return;
  }

  if (select === NON_SELECTED || !data) return;

  btn.value?.focus();
  btn.value?.click();
});
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
        <a href="/app/learn" class="flex items-center">
          <Icon>close</Icon>
        </a>
        <progress
          class="progress progress-success w-full"
          :value="Math.floor((100 / MAX_LESSON) * currentClass.currentLesson)"
          max="100"
        />
      </div>

      <div class="max-w-lg mx-auto pt-4 px-4">
        <slot v-if="data" />
        <template v-else>
          <span
            class="loading loading-spinner loading-sm absolute bottom-1/2 right-1/2 translate-x-1/2"
          />
        </template>
      </div>
    </div>

    <div
      v-if="data"
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
            @click="verify"
            class="btn-md btn-primary w-full"
            :disabled="select === NON_SELECTED || !data"
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
              <template v-if="finishObj.correct"> Correto! </template>

              <template v-else> Errado! </template>
            </p>
          </div>

          <Btn
            v-model="btn"
            @click="next"
            class="btn-md btn-neutral float-right"
            :loading="!nextLesson"
            :disabled="!nextLesson"
          >
            Continuar
          </Btn>
        </div>
      </div>
    </div>
  </main>
</template>
