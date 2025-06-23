import queryKeys from '~/queryKeys'

function useChatQuery(username: MaybeRef<string>) {
  const headers = useRequestHeaders(['cookie'])

  return useServerQuery({
    queryKey: queryKeys.chat(username),
    queryFn: () => $fetch(`/api/chat/${toValue(username)}` as `/api/chat/:username`, {
      headers,
    }),
  })
}

export default useChatQuery
