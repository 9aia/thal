<script setup lang="ts">
import { t } from "@psitta/vue"
import type { Unit } from "../../../types"

const unit = defineProps<Unit>()

const isModalOpen = ref(false)
</script>

<template>
  <section
    :id="`unit-${unit.id}`"
  >
    <div class="block bg-white border-t border-slate-300">
      <div class="max-w-lg mx-auto px-4 bg-white flex justify-between items-center">
        <h3 class="font-bold mb-4 mt-4">
          <span class="">{{ t(unit.name) }}</span>
        </h3>
        <div>
          <button
            class="btn btn-square btn-ghost"
            @click="isModalOpen = true"
          >
            <Icon>info</Icon>
          </button>
        </div>
      </div>
    </div>

    <Timeline class="my-4" :levels="getLevels(unit.levels)" />

    <Modal
      v-model="isModalOpen"
      confirm-text="Continue"
      @cancel="isModalOpen = false"
      @confirm="isModalOpen = false"
    >
      <h1 class="text-2xl mx-auto mb-2">
        {{ t('asd') }}
      </h1>
    </Modal>
  </section>
</template>
