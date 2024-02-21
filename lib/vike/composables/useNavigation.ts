import * as router from 'vike/client/router'

type Options = Parameters<typeof router['navigate']>[1]

export function useNavigation(url: string) {
  const prefetch = async () => router.prefetch(url)
  const navigate = async (options?: Options) => router.navigate(url, options)

  const replace = (
    { keepScrollPosition }: { keepScrollPosition: boolean } = {
      keepScrollPosition: true,
    },
  ) => {
    router.navigate(url, {
      keepScrollPosition,
      overwriteLastHistoryEntry: true,
    })
  }

  return { prefetch, navigate, replace }
}
