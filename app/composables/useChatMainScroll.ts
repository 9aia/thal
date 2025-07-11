import { useScroll } from '@vueuse/core'
import { chatMainRef } from '~/store'

const isScrollable = ref(false)

function useChatMainScroll() {
  const mainScroll = useScroll(chatMainRef, {
    behavior: 'smooth',
  })

  const isScrollDownButtonVisible = computed(() => {
    return !mainScroll.arrivedState.bottom && isScrollable.value
  })

  const updateScrollable = () => {
    const element = chatMainRef.value

    if (!element) {
      return
    }

    isScrollable.value = element.scrollHeight > element.clientHeight
  }

  const scrollBottom = () => {
    setTimeout(() => {
      if (!chatMainRef.value)
        return
      mainScroll.y.value = chatMainRef.value.scrollHeight
    }, 0)
  }

  return {
    isScrollDownButtonVisible,
    updateScrollable,
    scrollBottom,
  }
}

export default useChatMainScroll
