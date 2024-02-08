<script setup lang="ts">
import { readonly, ref } from "vue";

const dialog = ref<HTMLDialogElement>();

const props = withDefaults(
  defineProps<{
    classes?: string;
    confirmText?: string;
    cancelText?: string;
    hideConfirm?: boolean;
    showCancel?: boolean;
  }>(),
  {
    classes: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    hideConfirm: false,
    showCancel: false,
  }
);

const visible = ref(false);

const show = () => {
  dialog.value?.showModal();
  visible.value = true;
};

const emit = defineEmits(["confirm", "cancel"]);

const cancel = () => {
  dialog.value?.close();
  emit("cancel");
};

const confirm = () => {
  dialog.value?.close();
  emit("confirm");
};

defineExpose({
  show,
  close: (returnVal?: string): void => dialog.value?.close(returnVal),
  visible: readonly(visible),
});
</script>

<template>
  <dialog
    ref="dialog"
    @close="visible = false"
    class="modal modal-bottom sm:modal-middle"
  >
    <form
      class="modal-box"
      method="dialog"
      :class="{
        'modal-box rounded-none': true,
        [props.classes]: props.classes,
      }"
    >
      <slot />

      <div class="modal-action" v-if="!props.hideConfirm || props.showCancel">
        <slot name="footer" />

        <slot name="actions">
          <button
            v-if="props.showCancel"
            value="false"
            class="btn"
            @click.prevent="cancel"
          >
            {{ props.cancelText }}
          </button>

          <button
            v-if="!props.hideConfirm"
            value="true"
            class="btn btn-primary"
            @click.prevent="confirm"
          >
            {{ props.confirmText }}
          </button>
        </slot>
      </div>
    </form>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>
