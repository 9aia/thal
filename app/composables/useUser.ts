import type { User } from "~~/db/schema"

function useUser() {
  const user = useState<User | null>("user", () => null)
  return user
}

export default useUser
