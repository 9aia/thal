import type { Ref } from 'vue'
import { inject } from 'vue'
import type { Profile } from './schemas/profile'
import { useMemoize } from '@vueuse/core'

function useProfile() {
  const profile = inject<Ref<Profile>>('profile')!

  return profile
}

export default useProfile
