import { ref } from "vue"

type Type = "success" | "error" | "warning" | "info"

const message = ref<string>("")
const type = ref<Type>("success")
const duration = ref(3000)
const visible = ref(false)

const actions = ref<ToastAction[]>([])
const update = ref(false)

export interface ToastOptions {
  message: string
  type?: Type
  duration?: number
  actions?: ToastAction[]
}

export interface ToastAction {
  title: string
  onClick: () => void
}

export interface ToastMoreOptions {
  actions?: ToastAction[]
}

export function useToast() {
  let timer: any = null

  const open = (options: ToastOptions) => {
    visible.value = true
    message.value = options.message
    type.value = options.type || "success"
    duration.value = options.duration ?? 3000
    actions.value = options.actions ?? []
    update.value = !update.value

    if (timer)
      clearTimeout(timer)

    if (duration.value >= 1) {
      timer = setTimeout(() => {
        visible.value = false
      }, duration.value)
    }
  }
  const info = (
    message: string,
    duration?: number,
    options?: ToastMoreOptions,
  ) => open({ type: "info", message, duration, actions: options?.actions })

  const warn = (
    message: string,
    duration?: number,
    options?: ToastMoreOptions,
  ) => open({ type: "warning", message, duration, actions: options?.actions })

  const error = (
    message: string,
    duration?: number,
    options?: ToastMoreOptions,
  ) => open({ type: "error", message, duration, actions: options?.actions })

  const success = (
    message: string,
    duration?: number,
    options?: ToastMoreOptions,
  ) => open({ type: "success", message, duration, actions: options?.actions })

  const close = () => {
    visible.value = false
  }

  return {
    open,
    info,
    warn,
    error,
    success,
    close,
    visible,
    message,
    duration,
    type,
    actions,
    update,
  }
}
