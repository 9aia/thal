import * as semver from 'semver'
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
      if (semver.lt(version, '1.0.0')) {
        return 'early-access'
      }

      if (semver.gte(version, '1.0.0')) {
        return 'early-stable'
      }
    }
    return 'stable'
  })
}

export default useReleaseType
