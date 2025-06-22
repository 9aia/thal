import { useEventListener, useScroll } from '@vueuse/core'
import { chatMainRef } from '~/store'

function useChatHistoryScroll() {
  const mainScroll = useScroll(chatMainRef, {
    behavior: 'smooth',
  })

  const isScrollable = ref(false)
  const isScrollDownButtonVisible = computed(() => {
    return !mainScroll.arrivedState.bottom && isScrollable.value
  })

  const updateScrollable = () => {
    const element = chatMainRef.value

    if (!element) {
      return
    }

    isScrollable.value = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
  }

  const goToBottom = async () => {
    await nextTick()

    if (!chatMainRef.value)
      return

    mainScroll.y.value = chatMainRef.value.scrollHeight
  }

  return {
    isScrollDownButtonVisible,
    updateScrollable,
    goToBottom,
  }
}

export default useChatHistoryScroll
