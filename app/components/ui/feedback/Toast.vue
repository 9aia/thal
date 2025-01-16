<script setup lang="ts">
import { tv } from 'tailwind-variants'
import { computed, effect, ref } from 'vue'
import Icon from '../display/Icon.vue'

const styles = tv({
  base: 'alert border-0 flex justify-between',
  variants: {
    type: {
      info: 'bg-gradient-info',
      warning: 'bg-gradient-warning',
      error: 'bg-gradient-error',
      success: 'bg-gradient-success',
    },
  },
})

const actionStyles = tv({
  base: 'btn btn-sm btn-outline border-gray-800 text-gray-800 hover:bg-gray-800 hover:border-gray-800 hover:text-primary',
})

const toastStyles = tv({
  base: 'toast z-50 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5',
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
  success: 'check_circle',
  warning: 'warning',
  error: 'error',
  info: 'info',
}
const icon = computed(() => toast.icon.value || icons[toast.type.value || 'info'])

effect(() => {
  const duration = toast.duration.value ?? 3000

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
  <Transition>
    <div v-if="toast.visible.value" class="overflow-hidden" :class="toastStyles({ position: toast.position.value })">
      <div class="relative overflow-hidden" :class="styles({ type: toast.type.value })">
        <div class="flex items-center justify-center gap-2">
          <Icon :name="icon" class="text-gray-800" />

          <h3 class="text-gray-800 text-wrap text-left">
            {{ toast.message.value }}
          </h3>
        </div>

        <div class="flex items-center justify-center gap-4">
          <div v-if="toast.actions.value.length">
            <button
              v-for="action, index in toast.actions.value"
              :key="`action-${index}`"
              :class="actionStyles()"
              @click="action.onClick()"
            >
              {{ action.title }}
            </button>
          </div>

          <button
            class="w-5 h-5 flex items-center justify-center cursor-pointer"
            @click="toast.close()"
          >
            <Icon name="close" class="text-gray-800" />
          </button>
        </div>

        <div class="absolute overflow-hidden w-full h-full flex items-end pointer-events-none">
          <div
            v-if="toast.duration.value > 0"
            ref="el"
            class="animate-progress h-[2px] bg-gray-800"
            :style="{
              'animation-duration': `${toast.duration.value}ms`,
            }"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.bg-gradient-success {
  background: radial-gradient(at top, theme('colors.green.100'), theme('colors.gray.50'));
}

.bg-gradient-error {
  background: radial-gradient(at top, theme('colors.red.100'), theme('colors.gray.50'));
}

.bg-gradient-warning {
  background: radial-gradient(at top, theme('colors.orange.100'), theme('colors.gray.50'));
}

.bg-gradient-info {
  background: radial-gradient(at top, theme('colors.blue.100'), theme('colors.gray.50'));
}

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

.v-enter-active, .v-leave-active {
  transition: all 300ms ease-in-out;
}

.v-enter-from,
.v-leave-to {
  transform: translateX(50%) translateY(200px);
  opacity: 0;
}
</style>
