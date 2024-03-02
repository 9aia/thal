import type { Ref } from 'vue'
import { inject } from 'vue'
import type { User } from './schemas/user'

function useProfile() {
  const user = inject<Ref<User>>('user')!

  return user
}

export default useProfile
