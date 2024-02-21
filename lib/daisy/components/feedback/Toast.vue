<script setup lang="ts">
import { useToast } from "#lib/daisy/composables/useToast";
import { tv } from "tailwind-variants";
import { computed, effect, ref } from "vue";
import Icon from "../display/Icon.vue";

const styles = tv({
  base: "fixed bottom-4 right-1/2 translate-x-1/2 z-50 max-w-sm alert",
  variants: {
    type: {
      info: "alert-info",
      warning: "alert-warning",
      error: "alert-error",
      success: "alert-success",
    },
  },
});

const toast = useToast();
const el = ref<HTMLDivElement>();

type Icons = {
  [key: string]: string;
  success: string;
  warning: string;
  error: string;
  info: string;
};
const icons: Icons = {
  success: "check_circle",
  warning: "warning",
  error: "error",
  info: "information",
};
const icon = computed(() => icons[toast.type.value || "info"]);

effect(() => {
  const duration = toast.duration.value ?? 3000;

  if (el.value) {
    if (duration < 1) return;

    el.value.style.animationPlayState = "running";

    setTimeout(() => {
      toast.close();
    }, duration);
  }
});
</script>

<template>
  <Transition>
    <div v-if="toast.visible.value" :class="styles({ type: toast.type.value })">
      <Icon :name="icon" class="text-neutral" />
      <h3 class="text-neutral">{{ toast.message.value }}</h3>
      <div>
        <button
          @click="toast.close()"
          class="w-5 h-5 flex items-center justify-center cursor-pointer"
        >
          <Icon name="close" class="text-neutral" />
        </button>
      </div>
      <div
        v-if="toast.duration.value > 0"
        class="absolute bottom-0 animate-progress h-[2px] bg-neutral"
        ref="el"
        :style="{
          'animation-duration': toast.duration.value + 'ms',
        }"
      ></div>
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
