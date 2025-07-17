import type { Release } from '~/types'
import { version } from '~~/package.json'

function useReleaseType() {
  const runtimeConfig = useRuntimeConfig()

  return computed<Release>(() => {
    if (runtimeConfig.public.RUNTIME_ENV === 'dev') {
      return 'dev'
    }

    if (runtimeConfig.public.RUNTIME_ENV === 'preview') {
      return 'preview'
    }

    if (runtimeConfig.public.RUNTIME_ENV === 'production') {
      // MAJOR.MINOR.PATCH, eg. 0.1.0
      const [major, minor] = version.split('.').map(Number)

      if (major < 1) {
        return 'early-access'
      }

      if (major === 1 && minor === 0) {
        return 'early-stable'
      }
    }
    return 'stable'
  })
}

export default useReleaseType
