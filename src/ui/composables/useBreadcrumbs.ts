import { usePageContext } from '~/lib/vike/composables/usePageContext'
import { navigate } from 'vike/client/router'
import { computed } from 'vue'
import type { BreadcrumbItem } from '../components/navigation/types'

interface Options {
  urlPathname?: string
  root: BreadcrumbItem
  config: BreadcrumbItem[]
}

function useBreadcrumbs (options: Options) {
  const c = usePageContext()

  const path = computed(() => {
    return c.urlPathname
      .replaceAll(options.urlPathname!, '')
      .split('/')
      .filter(o => o !== '')
  })
  const items = computed(() => {
    const currentItem = options.config.find(o => o.id === path.value[0])
    if (!currentItem) { return [options.root] }

    return [options.root, currentItem]
  })

  const back = () => {
    navigate(options.urlPathname!)
  }

  return { items, path, back }
}

export default useBreadcrumbs
