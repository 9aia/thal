<script setup lang="ts">
import Btn from '#lib/daisy/components/action/Btn.vue'
import Icon from '#lib/daisy/components/display/Icon.vue'
import { t } from '#lib/i18n'
import { onMounted } from 'vue'
import { getUnits } from '../../utils'
import { sectionA1 } from '../../data/course'
import Timeline from '../../components/Timeline.vue'

const section = sectionA1
const currentSection = 'articles'

onMounted(() => {
  const unitUiRef = document.querySelector(`#unit-${currentSection}`)
  if (unitUiRef)
    unitUiRef.scrollIntoView({ behavior: 'smooth' })
})
</script>

<template>
  <section class="max-w-lg mx-auto mt-6 px-4 mb-8">
    <h2 class="text-2xl mb-1 font-bold">
      {{ t(section.name) }}
    </h2>

    <p class="text-base text-gray-700 mb-4">
      {{ t(section.description) }}
    </p>
  </section>

  <section
    v-for="unit in section.units"
    :id="`unit-${unit.id}`"
    :key="unit.id"
  >
    <div class="block bg-white">
      <div class="max-w-lg mx-auto px-4 bg-white flex justify-between items-center">
        <h3 class="font-bold mb-4 mt-4">
          <span class="">{{ t(unit.name) }}</span>
        </h3>
        <div>
          <Btn>
            <Icon>info</Icon>
          </Btn>
        </div>
      </div>
    </div>

    <Timeline class="my-4" :items="getUnits(unit.nodes)" />
  </section>

  <div class="card w-96 mx-auto bg-base-200 shadow-xl mt-4 mb-4">
    <div class="card-body">
      <h2 class="card-title">
        Congrats, you completed {{ section.name }}!
      </h2>
      <p class="">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga alias labore. Ea, pariatur quaerat.
      </p>
      <div class="card-actions justify-end">
        <button class="btn btn-primary">
          Next Section
        </button>
      </div>
    </div>
  </div>
</template>
