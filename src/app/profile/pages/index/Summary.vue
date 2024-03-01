<script setup lang="ts">
import { onMounted, ref } from 'vue'
import useProfile from '../../store'
import Btn from '#lib/daisy/components/action/Btn.vue'
import Icon from '#lib/daisy/components/display/Icon.vue'
import Skeleton from '#lib/daisy/components/feedback/Skeleton.vue'
import { useToast } from '#lib/daisy/composables/useToast'
import client from '#lib/hono/client'
import { t } from '#lib/i18n'

const toast = useToast()

const profile = useProfile()

const loading = ref(true)
const summary = ref('')

async function generateSummary() {
  const profileData: any = { ...profile?.value }
  delete profileData.name
  delete profileData.lastName

  const res = await client.app.summary.$post({
    json: profileData,
  })

  if (!res.ok)
    throw new Error('An error occurred while fetching your profile data.')

  const data = await res.json()

  return data.summary
}

async function regenerateSummary() {
  loading.value = true

  try {
    summary.value = await generateSummary()
  }
  catch (e) {
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
