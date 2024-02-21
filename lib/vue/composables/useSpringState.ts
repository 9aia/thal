import type { Ref, UnwrapRef } from 'vue'
import { onUnmounted, ref } from 'vue'

function useSpringState<V>(value: UnwrapRef<V>) {
  const state: Ref<UnwrapRef<V>> = ref(value as any)
  const isPending: Ref<boolean> = ref(false)

  let timer: ReturnType<typeof setTimeout>

  const set = (temporaryValue: UnwrapRef<V>, delay: number) => {
    state.value = temporaryValue
    isPending.value = true

    timer = setTimeout(() => {
      state.value = value
      isPending.value = false
    }, delay)
  }

  const abort = () => {
    clearTimeout(timer)
  }

  onUnmounted(abort)

  return { state, set, abort, isPending }
}

export default useSpringState
