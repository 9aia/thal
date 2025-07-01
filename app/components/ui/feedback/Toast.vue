<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { computed, effect, ref } from 'vue'
import Icon from '../display/Icon.vue'

const styles = tv({
  base: 'alert border-0 flex justify-between w-full relative',
  variants: {
    type: {
      info: 'bg-radial-[at_top] from-[var(--color-blue-100)] to-[var(--color-gray-50)]',
      warning: 'bg-radial-[at_top] from-[var(--color-orange-100)] to-[var(--color-gray-50)]',
      error: 'bg-radial-[at_top] from-[var(--color-red-100)] to-[var(--color-gray-50)]',
      success: 'bg-radial-[at_top] from-[var(--color-green-100)] to-[var(--color-gray-50)]',
    },
  },
})

const actionStyles = tv({
  base: 'btn btn-xs btn-soft btn-neutral text-black',
})

const toastStyles = tv({
  base: 'toast rounded-2xl z-[999]',
  variants: {
    position: {
      'start-top': 'toast-start toast-top',
      'start-middle': 'toast-start toast-middle',
      'start-bottom': 'toast-start toast-bottom',
      'center-top': 'toast-center toast-top',
      'center-middle': 'toast-center toast-middle',
      'center-bottom': 'toast-center toast-bottom',
      'end-top': 'toast-end toast-top',
      'end-middle': 'toast-end toast-middle',
      'end-bottom': 'toast-end toast-bottom',
    },
  },
})

const toast = useToast()
const el = ref<HTMLDivElement>()

interface Icons {
  [key: string]: string
  success: string
  warning: string
  error: string
  info: string
}
const icons: Icons = {
  success: 'material-symbols:check-circle-outline-rounded',
  warning: 'material-symbols:warning-outline-rounded',
  error: 'material-symbols:error-outline-rounded',
  info: 'material-symbols:info-outline-rounded',
}
const icon = computed(() => toast.icon.value || icons[toast.type.value || 'info'])

effect(() => {
  const duration = toast.duration.value ?? 5000

  if (el.value) {
    if (duration < 1)
      return

    el.value.style.animationPlayState = 'running'
  }
})

watch(toast.update, () => {
  if (el.value) {
    el.value.classList.remove('animate-progress')
    void el.value.offsetWidth
    el.value.classList.add('animate-progress')
  }
}, { immediate: true })
</script>

<template>
  <div class="fixed top-0 w-full h-dvh pointer-events-none">
    <div class="relative max-w-[1700px] mx-auto w-full h-full pointer-events-none">
      <Transition name="fade-in-out">
        <div
          v-if="toast.visible.value"
          class="overflow-hidden absolute"
          :class="toastStyles({ position: toast.position.value })"
        >
          <div :class="styles({ type: toast.type.value })">
            <Icon v-if="icon" :name="icon" class="text-gray-800" />
            <div>
              <h3>
                {{ toast.message.value }}
              </h3>
            </div>
            <div class="flex items-center justify-center gap-1">
              <template v-if="toast.actions.value.length">
                <button
                  v-for="action, index in toast.actions.value"
                  :key="`action-${index}`"
                  :class="actionStyles()"
                  @click="action.onClick"
                >
                  {{ action.title }}
                </button>
              </template>

              <slot name="actions" />

              <Button
                class="cursor-pointer rounded-full p-1 hover:text-gray-700 flex focus:outline-neutral focus:outline-2 focus:outline-offset-2"
                icon="material-symbols:close-rounded"
                icon-class="text-lg"
                @click="toast.close()"
              />
            </div>

            <div class="absolute overflow-hidden w-full h-full flex items-end pointer-events-none left-0 px-4">
              <div
                v-if="toast.duration.value > 0"
                ref="el"
                class="animate-progress h-[2px] bg-gray-800 rounded-full"
                :style="{
                  'animation-duration': `${toast.duration.value}ms`,
                }"
              />
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@reference '~/assets/css/main.css';

.animate-progress {
  animation: fill-progress linear;
  animation-play-state: paused;
}

@keyframes fill-progress {
  from {
    width: 100%;
  }
  to {
    width: 0;
  }
}

.fade-in-out-enter-active,
.fade-in-out-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.fade-in-out-enter-from,
.fade-in-out-leave-to {
  @apply opacity-0;
}
</style>
