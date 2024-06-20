<script setup lang="ts">
import { BLANK } from "~/constants/exercises"

const select1 = ref<any>()
const select2 = ref<any>()
</script>

<template>
  <div class="max-w-lg mx-auto text-center">
    <div class="w-full flex flex-col p-4 left-0 bottom-1/2 translate-y--1/2">
      <ReadAndAnswer
        v-model="select1"
        text="hello"
        question="asdasd"
        :alternatives="['a', 'b', 'c']"
      />

      {{ select1 }}

      <FillInTheBlank
        v-model="select2"
        :text="`asdasd ${BLANK} asd`"
        :alternatives="['aaaa', 'b', 'c']"
        :correct-length="4"
      />

      {{ select2 }}
    </div>
  </div>
</template>
