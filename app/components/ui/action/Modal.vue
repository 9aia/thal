<script setup lang="ts">
import Button from './Button.vue'

const props = withDefaults(
  defineProps<{
    classes?: string

    // header
    title?: string
    showCloseButton?: boolean

    // content
    contentClass?: string
    noScroll?: boolean

    // footer
    confirmText?: string
    confirmIcon?: string
    cancelText?: string
    cancelIcon?: string
    hideConfirm?: boolean
    showCancel?: boolean
    confirmLoading?: boolean
  }>(),
  {
    classes: '',

    showCloseButton: false,

    noScroll: false,

    confirmText: 'Confirm',
    cancelText: 'Cancel',
    hideConfirm: false,
    showCancel: false,
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
          class="modal-box bg-white rounded-3xl sm:w-11/12 sm:max-w-xl p-0"
          method="dialog"
          :class="props.classes"
          @submit="emit('confirm')"
        >
          <form v-if="showCloseButton" method="dialog">
            <Button
              class="btn btn-neutral btn-sm btn-circle btn-ghost absolute right-4 top-4 z-20"
              icon="material-symbols:close-rounded"
              icon-class="text-xl"
            />
          </form>

          <div :class="contentClass">
            <div
              class="px-4 pb-6 my-6 focus:outline-2 focus:outline-primary"
              :class="{
                'max-h-128 overflow-auto': !noScroll,
              }"
            >
              <header class="sticky top-0 px-8 pt-6 pb-4 bg-white z-10">
                <h1 v-if="title" class="mb-4 text-sm text-black">
                  {{ title }}
                </h1>

                <slot name="header" />
              </header>

              <slot />
            </div>
          </div>

          <div v-if="!props.hideConfirm || props.showCancel" class="modal-action p-4">
            <slot name="footer" />

            <slot name="actions">
              <Button
                v-if="props.showCancel"
                value="false"
                class="btn btn-neutral"
                :icon="props.cancelIcon"
                @click.prevent="visible = false"
              >
                {{ props.cancelText }}
              </Button>

              <Button
                v-if="!props.hideConfirm"
                value="true"
                class="btn btn-primary"
                :loading="confirmLoading"
                :icon="props.confirmIcon"
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
