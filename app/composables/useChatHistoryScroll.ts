import { useEventListener, useScroll } from '@vueuse/core'
import { chatContainerRef } from '~/store'

function useChatHistoryScroll() {
  const mainScroll = useScroll(chatContainerRef, {
    behavior: 'smooth',
  })

  const isScrollable = ref(false)

  useEventListener(chatContainerRef, 'scroll', () => {
    const element = chatContainerRef.value!

    if (!element) {
      return
    }

    isScrollable.value = element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth
  })

  const isScrollDownButtonVisible = computed(() => {
    return !mainScroll.arrivedState.bottom && isScrollable.value
  })

  const goToBottom = async () => {
    await nextTick()

    if (!chatContainerRef.value)
      return

    mainScroll.y.value = chatContainerRef.value.scrollHeight
  }

  return {
    isScrollDownButtonVisible,
    goToBottom,
  }
}

export default useChatHistoryScroll
