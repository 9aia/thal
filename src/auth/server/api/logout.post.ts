import { invalidateSession } from "../services/user"

export default eventHandler(async (event) => {
  await invalidateSession(event)

  return sendRedirect(event, "/sign-in")
})
