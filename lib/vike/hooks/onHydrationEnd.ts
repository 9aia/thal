import type { OnHydrationEndSync } from 'vike/types'
import listenToPrefersDark from '#lib/theme/listenToPrefersDark'

export const onHydrationEnd: OnHydrationEndSync
  = (): ReturnType<OnHydrationEndSync> => {
    document.body.classList.add('is-hydrated')
    listenToPrefersDark()
  }
