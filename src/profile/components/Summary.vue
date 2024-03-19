<script setup lang="ts">
import type { User } from 'lucia';
import { useI18n } from '@psitta/vue'

const toast = useToast()
const { t } = useI18n()
const user = inject<Ref<User>>('profile')!

const loading = ref(true)
const summary = ref('')

async function generateSummary () {
  const profile = user.value!

  const data = await $fetch(`/api/profile/summary/${profile.username}` as `/api/profile/summary/:username`, {
    method: 'get',
    body: {
      goals: profile.goals,
      hobbies: profile.hobbies,
      profession: profile.profession,
      observation: profile.observation,
    },
  })

  return data.summary;
}

async function regenerateSummary () {
  loading.value = true

  try {
    summary.value = await generateSummary()
  } catch (e) {
    toast.error(t('An error occurred while generating the summary.'))
  }

  loading.value = false
}

onMounted(async () => {
  regenerateSummary()
})
</script>

<template>
  <section>
    <h2 class="text-2xl text-slate-800 mb-4 font-bold mt-4">
      {{ t("Summary") }}
    </h2>

    <div>
      <template v-if="loading">
        <Skeleton class="w-full h-32" />
      </template>
      <template v-else>
        <p class="text-md text-gray-900">
          {{ summary }}
        </p>
      </template>
    </div>

    <Btn class="mt-2" :loading="loading" @click="regenerateSummary()">
      <Icon>redo</Icon>
    </Btn>
  </section>
</template>
