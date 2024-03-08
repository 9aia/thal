<script setup lang="ts">
import * as _ from 'lodash-es'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { useI18n } from '~/lib/psitta/vue'
import Modal from '~/src/ui/components/action/Modal.vue'
import Checkbox from '~/src/ui/components/data-input/Checkbox.vue'
import Icon from '~/src/ui/components/display/Icon.vue'
import { useToast } from '~/src/ui/composables/useToast'
import { HOBBIES, MAX_HOBBIES_AMOUNT } from '~/src/base/constants'
import { parseJoin } from '~/src/base/utils/string'
import { parseInitialValues } from '../utils'

const { t } = useI18n()
const toast = useToast()
const user = useUser()

const initialValues = parseInitialValues(user.value!.hobbies || '')
const form = useForm<Record<string, boolean | undefined>>({
  initialValues,
})
const keys = computed(() => {
  const values = form.values
  return Object.keys(values)
    .filter(key => values[key])
    .join(', ')
})
const hobbyNames = computed(() => {
  const hobbies = parseJoin(keys.value, HOBBIES)
  return hobbies.map(hobby => hobby.name)
})

const search = ref('')
const filteredList = computed(() => {
  return HOBBIES.filter(hobby =>
    hobby.name.toLowerCase().includes(search.value.toLowerCase()),
  )
})

const isOpen = defineModel({ default: false })
const loading = ref(false)

const submit = form.handleSubmit(async () => {
  const username = user.value!.username
  const currentKeys = keys.value

  loading.value = true

  const res = await client.app.profile[':username'].$patch({
    param: {
      username,
    },
    json: {
      hobbies: currentKeys,
    },
  })

  if (!res.ok) {
    toast.error(t('An error occurred while updating hobbies.'))
  }
  else {
    user.value = { ...user.value, hobbies: currentKeys }

    toast.success(t('Hobbies were updated successfully.'))
  }

  loading.value = false
  isOpen.value = false
})
</script>

<template>
  <Modal
    v-model="isOpen"
    :confirm-text="t('Save')"
    :loading="loading"
    @confirm="submit"
  >
    <template #default>
      <h1 class="font-bold text-2xl mb-2 mt-4">
        {{ t("Hobbies") }}
      </h1>

      <p class="text-gray-700 mb-4">
        {{
          t("Pick up to {max} hobbies or sports you enjoy that you want to AI know about you.", {
            max: MAX_HOBBIES_AMOUNT,
          })
        }}
      </p>

      <div class="form-control">
        <input
          v-model="search"
          type="text"
          placeholder="Search"
          class="input input-bordered w-auto mb-4"
        >
      </div>

      <div class="h-[200px] px-2 overflow-auto">
        <Checkbox
          v-for="hobby in HOBBIES"
          :key="hobby.id"
          :path="hobby.id"
          :label="hobby.name"
          :class="{
            hidden: search && !filteredList.find((o) => o.name === hobby.name),
          }"
          :disabled="
            !hobbyNames.find((name) => name === hobby.name)
              && hobbyNames.length === MAX_HOBBIES_AMOUNT
          "
        >
          <Icon>{{ hobby.icon }}</Icon>
          {{ hobby.name }}
        </Checkbox>

        <div v-if="search && !filteredList.length" class="item error">
          <p>{{ t("No results found.") }}</p>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="w-full mr-2">
        <p class="font-bold">
          {{
            t("{selected}/{max} selected", {
              selected: hobbyNames.length,
              max: MAX_HOBBIES_AMOUNT,
            })
          }}
        </p>

        <small class="text-xs">
          {{ _.truncate(hobbyNames.join(", "), { length: 60 }) }}
        </small>
      </div>
    </template>
  </Modal>
</template>
