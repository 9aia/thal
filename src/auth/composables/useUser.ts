import type { User } from "lucia"

function useUser() {
  const user = useState<User | null>("user", () => null)
  return user
}

export default useUser
