export default defineEventHandler((event) => {
  const user = event.context.user
  return user
})
