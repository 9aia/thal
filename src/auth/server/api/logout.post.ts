export default eventHandler(async (event) => {
  const lucia = event.context.lucia

  if (!event.context.session) {
    throw createError({
      statusCode: 401,
    })
  }

  await lucia.invalidateSession(event.context.session.id)
  
  appendHeader(
    event,
    'Set-Cookie',
    lucia.createBlankSessionCookie().serialize()
  )

  return sendRedirect(event, '/sign-in')
})
