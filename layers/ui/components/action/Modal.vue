<script setup lang="ts">
import Btn from "./Btn.vue"

const props = withDefaults(
  defineProps<{
    classes?: string
    confirmText?: string
    cancelText?: string
    hideConfirm?: boolean
    showCancel?: boolean
    loading?: boolean
    showCloseButton?: boolean
  }>(),
  {
    classes: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    hideConfirm: false,
    showCancel: false,
    showCloseButton: false,
  },
)

const emit = defineEmits(["cancel", "confirm"])

const dialog = ref<HTMLDialogElement>()

const visible = defineModel({ default: false })

watch(visible, () => {
  if (visible.value)
    dialog.value?.showModal()
  else
    dialog.value?.close()
})
</script>

<template>
  <dialog
    ref="dialog"
    class="modal modal-bottom sm:modal-middle"
    @close="visible = false"
  >
    <form
      class="modal-box rounded-none"
      method="dialog"
      :class="{
        [props.classes]: props.classes,
      }"
      @submit="emit('confirm')"
    >
      <form v-if="showCloseButton" method="dialog">
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
          ✕
        </button>
      </form>

      <slot />

      <div v-if="!props.hideConfirm || props.showCancel" class="modal-action">
        <slot name="footer" />

        <slot name="actions">
          <Btn
            v-if="props.showCancel"
            value="false"
            class="btn"
            @click.prevent="visible = false"
          >
            {{ props.cancelText }}
          </Btn>

          <Btn
            v-if="!props.hideConfirm"
            value="true"
            class="btn-primary"
            :loading="loading"
            @click.prevent="emit('confirm')"
          >
            {{ props.confirmText }}
          </Btn>
        </slot>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button @click.prevent="visible = false">
        close
      </button>
    </form>
  </dialog>
</template>
