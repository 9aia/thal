import { useQueryClient } from '@tanstack/vue-query'
import queryKeys from '~/queryKeys'

export default defineNuxtRouteMiddleware(async (event) => {
  const user = useUser()
  const { t } = useI18nExperimental()

  const username = event.params.username as string
  const fetchCharacter = useCharacterFetchFn(username)
  const data = await fetchCharacter()

  // Set the character data in the query client to avoid refetching the data on the route that have this middleware
  event.meta.character = data

  // SEO
  const name = data?.name
  const title = name ? t('Talk to "{name}" thal. Learn English.', { name }) : t('Thal | {username} not found', { username: `@${username}` })
  const description = t('Get translations, corrections, and listening while chatting. Try it for free to level up your English.')

  useSeoMeta({
    // HTML tags
    title,
    description,
    // Facebook tags
    ogTitle: title,
    ogDescription: description,
    // Twitter tags
    twitterTitle: title,
    twitterDescription: description,
  })

  if (!user.value)
    return saveRouteAndNavigateTo(event, '/sign-in')

  if (!isPlanActive(user.value)) {
    return saveRouteAndNavigateTo(event, '/pricing')
  }
})
