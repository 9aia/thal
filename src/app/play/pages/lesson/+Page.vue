<script setup lang="ts">
import { onMounted, ref, markRaw } from "vue";
import { exercise, select } from "../../store";

const components = import.meta.glob("../../components/*.vue");

const comp = ref<any>();

async function loadComponent(name: string) {
  const path = `../../components/${name}.vue`;

  if (components[path]) {
    try {
      const c = await components[path]() as any;
      comp.value = markRaw(c.default);
    } catch (error) {
      console.error("Error loading the component: ", error);
    }
  }
}

onMounted(() => {
  loadComponent("ReadAndAnswer");
});
</script>

<template>
  <div class="w-full flex flex-col">
    <component
      v-if="exercise"
      :is="comp"
      v-model="select"
      v-bind="exercise?.data"
    />
  </div>
</template>
