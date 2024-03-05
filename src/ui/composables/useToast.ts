import { ref } from 'vue'

type Type = 'success' | 'error' | 'warning' | 'info'

const message = ref<string>('No information provided.')
const visible = ref<boolean>(false)
const type = ref<Type>('success')
const duration = ref(3000)

interface ToastOptions {
  message: string
  type?: Type
  duration?: number
}

export function useToast () {
  const open = (options: ToastOptions) => {
    visible.value = true
    message.value = options.message
    type.value = options.type || 'success'
    duration.value = options.duration ?? 3000
  }
  const info = (message: string, duration?: number) =>
    open({ type: 'info', message, duration })
  const warn = (message: string, duration?: number) =>
    open({ type: 'warning', message, duration })
  const error = (message: string, duration?: number) =>
    open({ type: 'error', message, duration })
  const success = (message: string, duration?: number) =>
    open({ type: 'success', message, duration })

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
  }
}
