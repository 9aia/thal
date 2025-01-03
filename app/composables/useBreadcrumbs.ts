import { computed } from 'vue'
import type { BreadcrumbItem } from '../../../app/components/ui/navigation/types'

interface Options {
  path?: string
  root: BreadcrumbItem
  config: BreadcrumbItem[]
}

function useBreadcrumbs(options: Options) {
  const route = useRoute()

  const path = computed(() => {
    return route.path
      .replaceAll(options.path!, '')
      .split('/')
      .filter(o => o !== '')
  })
  const items = computed(() => {
    const currentItem = options.config.find(o => o.id === path.value[0])
    if (!currentItem)
      return [options.root]

    return [options.root, currentItem]
  })

  const back = () => {
    navigateTo(options.path!)
  }

  return { items, path, back }
}

export default useBreadcrumbs
