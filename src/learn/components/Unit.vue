<script setup lang="ts">
import type { Unit } from '../types'
import { t } from '@psitta/vue'

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
            @click="isModalOpen = true"
            class="btn btn-square btn-ghost"
          >
            <Icon>info</Icon>
          </button>
        </div>
      </div>
    </div>

    <Timeline class="my-4" :items="getUnits(unit.nodes)" />

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