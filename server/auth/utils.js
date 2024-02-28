export async function getUser(cookies) {
  const res = await fetch('http://localhost:3000/api/app/profile/logged', {
    headers: {
      Cookie: cookies,
    },
  })

  if (res.ok) {
    const user = await res.json()
    return user
  }

  return null
}
