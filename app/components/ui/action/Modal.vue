<script setup lang="ts">
import Button from './Button.vue'

const props = withDefaults(
  defineProps<{
    classes?: string
    confirmText?: string
    cancelText?: string
    hideConfirm?: boolean
    showCancel?: boolean
    loading?: boolean
    showCloseButton?: boolean
    contentClass?: string
    noPadding?: boolean
  }>(),
  {
    classes: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    hideConfirm: false,
    showCancel: false,
    showCloseButton: false,
  },
)

const emit = defineEmits(['cancel', 'confirm'])
const visible = defineModel({ default: false })

const dialog = ref<HTMLDialogElement>()

watch([visible, dialog], () => {
  if (visible.value)
    dialog.value?.showModal()
  else
    dialog.value?.close()
})
</script>

<template>
  <Teleport to="body">
    <ClientOnly>
      <dialog
        ref="dialog"
        class="modal modal-bottom sm:modal-middle max-w-auto"
        @close="visible = false"
      >
        <form
          class="modal-box bg-white rounded-3xl sm:w-11/12 sm:max-w-xl"
          method="dialog"
          :class="{
            'p-0': props.noPadding,
            [props.classes]: props.classes,
          }"
          @submit="emit('confirm')"
        >
          <form v-if="showCloseButton" method="dialog">
            <button class="btn btn-neutral btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20">
              ✕
            </button>
          </form>

          <div :class="contentClass">
            <slot />
          </div>

          <div v-if="!props.hideConfirm || props.showCancel" class="modal-action">
            <slot name="footer" />

            <slot name="actions">
              <Button
                v-if="props.showCancel"
                value="false"
                class="btn btn-neutral"
                @click.prevent="visible = false"
              >
                {{ props.cancelText }}
              </Button>

              <Button
                v-if="!props.hideConfirm"
                value="true"
                class="btn btn-primary"
                :loading="loading"
                @click.prevent="emit('confirm')"
              >
                {{ props.confirmText }}
              </Button>
            </slot>
          </div>
        </form>
        <form method="dialog" class="modal-backdrop">
          <button @click.prevent="visible = false">
            close
          </button>
        </form>
      </dialog>
    </ClientOnly>
  </Teleport>
</template>
