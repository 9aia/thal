import { ref } from 'vue'

type Type = 'success' | 'error' | 'warning' | 'info'
type Position = 'start-top' | 'start-middle' | 'start-bottom'
  | 'center-top' | 'center-middle' | 'center-bottom'
  | 'end-top' | 'end-middle' | 'end-bottom'

const message = ref<string>('')
const type = ref<Type>('success')
const duration = ref(3000)
const visible = ref(false)
const icon = ref<string>()
const position = ref<Position>('end-bottom')
const meta = ref<Record<string, any>>({})

const actions = ref<ToastAction[]>([])
const update = ref(false)

export interface ToastOptions {
  message: string
  type?: Type
  duration?: number
  actions?: ToastAction[]
  position?: Position
  icon?: string
  meta?: Record<string, any>
}

export interface ToastAction {
  title: string
  onClick: () => void
}

export interface ToastMoreOptions {
  actions?: ToastAction[]
  position?: Position
  icon?: string
  meta?: Record<string, any>
}

export function useToast() {
  let timer: any = null

  const open = (options: ToastOptions) => {
    visible.value = true
    message.value = options.message
    type.value = options.type || 'success'
    duration.value = options.duration ?? 5000
    position.value = options.position ?? 'end-bottom'
    actions.value = options.actions ?? []
    update.value = !update.value
    icon.value = options.icon
    meta.value = options.meta ?? {}

    if (timer)
      clearTimeout(timer)

    if (duration.value >= 1) {
      timer = setTimeout(() => {
        visible.value = false
      }, duration.value)
    }
  }
  type SendFn = (message: string, duration?: number, options?: ToastMoreOptions) => void

  const info: SendFn = (message, duration, options) => open({ type: 'info', message, duration, ...options })
  const warn: SendFn = (message, duration, options) => open({ type: 'warning', message, duration, ...options })
  const error: SendFn = (message, duration, options) => open({ type: 'error', message, duration, ...options })
  const success: SendFn = (message, duration, options) => open({ type: 'success', message, duration, ...options })

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
    position,
    message,
    duration,
    type,
    icon,
    actions,
    update,
    meta,
  }
}
