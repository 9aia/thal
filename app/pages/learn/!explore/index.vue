<script setup lang="ts">
import { T, useI18n } from "@psitta/vue"
import { learnStore } from "../../../store"

definePageMeta({
  middleware: "premium",
  layout: "app",
})

const { t } = useI18n()
const toast = useToast()

const { data, isLoading, isError, refetch } = await useServerQuery(`/api/learn/section/${learnStore.currentSection}`, {
  queryKey: ["/learn/section", learnStore.currentSection],
})

watch(isError, (value) => {
  if (value)
    toast.error(t("Failed to load section data. Try again later."))
})

const currentUnit = ref("articles")

onMounted(() => {
  const unitUiRef = document.querySelector(`#unit-${currentUnit.value}`)
  if (unitUiRef)
    unitUiRef.scrollIntoView({ behavior: "smooth" })
})
</script>

<template>
  <Resource :loading="isLoading" :error="isError" @execute="refetch">
    <div>
      <div class="absolute right-1/2 top-4 translate-x-1/2">
        <A href="/explore/sections" class="flex items-center text-lg gap-1">
          <span class="text-xl">{{ data.name }}</span>
          <Icon class="!text-3xl">keyboard_arrow_down</Icon>
        </A>
      </div>

      <section class="pt-16 lg:pt-16 max-w-lg mx-auto px-4 mb-8">
        <h2 class="text-2xl mb-1 font-bold">
          {{ t(data.name) }}
        </h2>

        <p class="text-base text-gray-700 mb-4">
          {{ t(data.description) }}
        </p>
      </section>

      <Unit v-for="unit in data.units" v-bind="unit" :key="unit.slug" />

      <div class="card w-96 mx-auto bg-transparent border border-slate-900 shadow-xl mt-16 mb-4">
        <div class="card-body">
          <h2 class="card-title text-slate-800">
            <T text="Congrats, you completed {sectionName}!" :values="{ sectionName: data.name }">
              <template #sectionName>
                {{ data.name }}
              </template>
            </T>
          </h2>

          <p class="text-slate-900">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Incidunt fuga alias labore. Ea, pariatur quaerat.
          </p>

          <div class="card-actions justify-end">
            <button class="btn btn-primary text-slate-900">
              {{ t('Next Section') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Resource>
</template>
