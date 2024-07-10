<script setup lang="ts">
import { computed, ref } from "vue"
import { t } from "@psitta/vue"
import { GOALS, HOBBIES } from "~/constants/base"

const user = useUser()

const isHobbyModalOpen = ref(false)
const isProfessionModalOpen = ref(false)
const isGoalsModalOpen = ref(false)
const isObservationModalOpen = ref(false)

const hobbies = computed(() => {
  return parseJoin(user.value!.hobbies || "", HOBBIES)
})
const goals = computed(() => {
  return parseJoin(user.value!.goals || "", GOALS)
})

definePageMeta({
  middleware: "premium",
  layout: "setting",
})
</script>

<template>
  <div>
    <h1 class="text-4xl font-bold mb-4">
      {{ t("Profile") }}
    </h1>

    <div class="divide-y divide-base-200 space-y-4">
      <section class="pb-4">
        <h2 class="text-teal-900 font-bold text-lg mb-3">
          {{ t("Goals") }}
        </h2>

        <p class="mb-4">
          {{
            t(
              "What are your learning goals? Are they aiming for basic conversation, business English, reading comprehension, writing skills, or something else?",
            )
          }}
        </p>

        <div class="flex flex-wrap gap-2 items-center">
          <div v-for="goal in goals" :key="goal.id" class="badge p-4 gap-2">
            <Icon>{{ goal.icon }}</Icon>
            {{ t(goal.name) }}
          </div>

          <div v-if="!goals?.length">
            {{ t("No goals added.") }}
          </div>

          <Btn
            class="text-black flex items-center"
            :class="{ 'btn-primary': !goals?.length }"
            @click="isGoalsModalOpen = true"
          >
            <template v-if="!goals?.length">
              <Icon>add</Icon>
              {{ t("Add goals") }}
            </template>
            <template v-else>
              <Icon>edit</Icon>
              {{ t("Edit goals") }}
            </template>
          </Btn>

          <GoalsModal v-model="isGoalsModalOpen" />
        </div>
      </section>

      <section class="pt-6">
        <h2 class="text-teal-900 font-bold text-lg mb-3">
          {{ t("Interests") }}
        </h2>

        <p class="mb-4">
          {{
            t(
              "What are your hobbies, interests, and profession? This helps personalize content and examples to make learning more engaging.",
            )
          }}
        </p>

        <div class="flex flex-wrap gap-2 items-center">
          <div v-for="hobby in hobbies" :key="hobby.id" class="badge p-4 gap-2">
            <Icon>{{ hobby.icon }}</Icon>
            {{ t(hobby.name) }}
          </div>

          <div v-if="!hobbies?.length">
            {{ t("No hobbies added.") }}
          </div>

          <Btn
            class="text-black flex items-center"
            :class="{ 'btn-primary': !hobbies?.length }"
            @click="isHobbyModalOpen = true"
          >
            <template v-if="!hobbies?.length">
              <Icon>add</Icon>
              {{ t("Add hobbies") }}
            </template>
            <template v-else>
              <Icon>edit</Icon>
              {{ t("Edit hobbies") }}
            </template>
          </Btn>

          <HobbyModal v-model="isHobbyModalOpen" />
        </div>

        <div class="flex gap-2 flex-wrap items-center mt-6">
          <div v-if="user!.profession">
            <div class="flex items-center gap-2">
              <Icon>work</Icon>
              <div>
                <span class="font-bold">My profession</span>:
                <span>{{ user!.profession }}</span>
              </div>
            </div>
          </div>

          <Btn
            class="text-black flex items-center"
            :class="{ 'btn-primary': !user!.profession }"
            @click="isProfessionModalOpen = true"
          >
            <template v-if="!user!.profession">
              <Icon>add</Icon>
              {{ t("Add profession") }}
            </template>

            <template v-else>
              <Icon>edit</Icon>
              {{ t("Edit profession") }}
            </template>
          </Btn>

          <ProfessionModal v-model="isProfessionModalOpen" />
        </div>
      </section>

      <section class="pt-6">
        <h2 class="text-teal-900 font-bold text-lg mb-3">
          {{ t("Observation") }}
        </h2>

        <p class="mb-4">
          {{
            t(
              "Share any additional details you think might help AI personalize your learning experience.",
            )
          }}
        </p>

        <div class="mt-4 space-y-2">
          <div v-if="user!.observation">
            <textarea
              readonly
              class="textarea text-md border border-base-200 leading-[1.6em] h-40 w-full resize-none"
              :value="user!.observation"
            />
          </div>

          <Btn
            class="text-black flex items-center"
            @click="isObservationModalOpen = true"
          >
            <template v-if="!user!.observation">
              <Icon>add</Icon>
              {{ t("Add observation") }}
            </template>

            <template v-else>
              <Icon>edit</Icon>
              {{ t("Edit observation") }}
            </template>
          </Btn>

          <ClientOnly>
            <ObservationModal v-model="isObservationModalOpen" />
          </ClientOnly>
        </div>
      </section>
    </div>
  </div>
</template>
