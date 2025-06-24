export default {
  contacts: ['contacts'], // TODO: remove this (instead use contactsSearch with empty search)
  contactsSearch: (search: MaybeRef<string>) => ['contacts', search],
  contact: (username: MaybeRef<string>) => ['contact', username],
  chat: (username: MaybeRef<string>) => ['chat', username],
  history: (username: MaybeRef<string>) => ['history', username],
  chatsSearch: (locale: MaybeRef<string>, search: MaybeRef<string>) => [locale, 'chats', search],
  myCharacters: ['my-characters'],
  discoverCharacters: (locale: MaybeRef<string>) => [locale, 'discover-characters'], // TODO: remove this (instead use discoverCharactersSearch with empty search)
  discoverCharactersSearch: (locale: MaybeRef<string>, search?: MaybeRef<string | undefined>, categoryId?: MaybeRef<number | undefined>) => [locale, 'discover-characters', search, categoryId],
  character: (locale: MaybeRef<string>, username: MaybeRef<string>) => [locale, 'character', username],
  profile: (username: MaybeRef<string>) => ['profile', username],
  characterDraft: (locale: MaybeRef<string>) => [locale, 'character-draft'],
  characterDraftEdit: (locale: MaybeRef<string>, characterId: MaybeRef<number | null>) => [locale, 'character-draft', characterId],
  contentCount: (locale: MaybeRef<string>, name?: MaybeRef<string | undefined>) => [locale, 'content-count', name],
  pricingData: ['pricing-data'],
  messageSend: (username: MaybeRef<string>) => ['message-send', username],
  messageEdit: (username: MaybeRef<string>) => ['message-edit', username],
}
