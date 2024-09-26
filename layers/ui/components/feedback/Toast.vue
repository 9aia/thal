<script setup lang="ts">
import { tv } from "tailwind-variants"
import { computed, effect, ref } from "vue"
import Icon from "../display/Icon.vue"
import { useToast } from "../../composables/useToast"

const styles = tv({
  base: "fixed bottom-4 right-1/2 translate-x-1/2 max-w-lg z-50 alert overflow-hidden border-0",
  variants: {
    type: {
      info: "alert-info",
      warning: "alert-warning",
      error: "alert-error",
      success: "alert-success",
    },
  },
})

const actionStyles = tv({
  base: "btn text-neutral",
  variants: {
    type: {
      info: "btn-info",
      warning: "btn-warning",
      error: "btn-error",
      success: "btn-success",
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
  success: "check_circle",
  warning: "warning",
  error: "error",
  info: "info",
}
const icon = computed(() => icons[toast.type.value || "info"])

effect(() => {
  const duration = toast.duration.value ?? 3000

  if (el.value) {
    if (duration < 1)
      return

    el.value.style.animationPlayState = "running"
  }
})

watch(toast.update, () => {
  if (el.value) {
    el.value.classList.remove("animate-progress")
    void el.value.offsetWidth
    el.value.classList.add("animate-progress")
  }
}, { immediate: true })
</script>

<template>
  <Transition>
    <div v-if="toast.visible.value" :class="styles({ type: toast.type.value })">
      <Icon :name="icon" class="text-neutral" />

      <h3 class="text-neutral">
        {{ toast.message.value }}
      </h3>

      <div class="flex items-center justify-center gap-4">
        <div v-if="toast.actions.value.length">
          <button
            v-for="action, index in toast.actions.value"
            :key="`action-${index}`"
            :class="actionStyles({ type: toast.type.value })"
            @click="action.onClick()"
          >
            {{ action.title }}
          </button>
        </div>

        <button
          class="w-5 h-5 flex items-center justify-center cursor-pointer"
          @click="toast.close()"
        >
          <Icon name="close" class="text-neutral" />
        </button>
      </div>

      <div
        v-if="toast.duration.value > 0"
        ref="el"
        class="absolute bottom-0 animate-progress h-[2px] bg-neutral"
        :style="{
          'animation-duration': `${toast.duration.value}ms`,
        }"
      />
    </div>
  </Transition>
</template>

<style>
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
