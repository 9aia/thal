import { refAutoReset } from '@vueuse/core'

function useRetry(fn: () => void, afterMs = 3000) {
  const disabled = refAutoReset(false, afterMs)

  const retry = () => {
    disabled.value = true
    fn()
  }

  return { disabled, retry }
}

export default useRetry
