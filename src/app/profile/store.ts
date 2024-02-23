import type { Ref } from 'vue'
import { inject } from 'vue'
import type { Profile } from './schemas/profile'

function useProfile() {
  const profile = inject<Ref<Profile>>('profile')!

  return profile
}

export default useProfile
