<script lang="ts" setup>
import { tv } from 'tailwind-variants'
import { inReplyTos } from '~/store'

const route = useRoute()
const username = computed(() => route.params.username as string)
const hasInReplyTo = computed(() => !!inReplyTos[username.value])

const { t } = useI18nExperimental()

const initialWarning = computed(() => t('This is A.I. and not a real person. Treat everything it says as fiction.'))
const isWarningExpanded = ref(false)

const span = tv({
  base: 'ml-1 text-brown-500 group-hover:underline group-focus:outline-2 group-focus:outline-offset-2 rounded-full group-focus:outline-blue-500',
})
</script>

<template>
  <footer class="bg-white flex items-end justify-center gap-2 w-full">
    <div class="flex flex-col w-full gap-1">
      <ChatFooterInputReply v-if="hasInReplyTo" />

      <div class="flex flex-col items-center w-full">
        <SendFieldset class="pb-0" />

        <button
          class="text-xs text-gray-500 text-center cursor-pointer focus:outline-none pt-2 pb-3 group"
          @click="isWarningExpanded = !isWarningExpanded"
        >
          <Transition name="fade" mode="out-in">
            <div
              v-if="isWarningExpanded"
              class="px-4"
            >
              {{ initialWarning }} {{ t('What is said should not be relied upon as fact or advice.') }}

              <span :class="span()">
                {{ t('Read less') }}
              </span>
            </div>

            <div
              v-else
              class="px-4"
            >
              {{ initialWarning }}

              <span :class="span()">
                {{ t('Read more') }}
              </span>
            </div>
          </Transition>
        </button>
      </div>
    </div>
  </footer>
</template>
