export default {
  contacts: ['contacts'], // TODO: remove this (instead use contactsSearch with empty search)
  contactsSearch: (search: MaybeRef<string>) => ['contacts', search],
  contact: (username: MaybeRef<string | null>) => ['contact', username],
  chat: (username: MaybeRef<string>) => ['chat', username],
  history: (username: MaybeRef<string>) => ['history', username],
  chatsSearch: (locale: MaybeRef<string>, search: MaybeRef<string>) => [locale, 'chats', search],
  myCharacters: ['my-characters'],
  discoverCharacters: (locale: MaybeRef<string>) => [locale, 'discover-characters'], // TODO: remove this (instead use discoverCharactersSearch with empty search)
  discoverCharactersSearch: (locale: MaybeRef<string>, search?: MaybeRef<string | undefined>, categoryId?: MaybeRef<number | undefined>) => [locale, 'discover-characters', search, categoryId],
  character: (locale: MaybeRef<string>, username: MaybeRef<string | null>) => [locale, 'character', username],
  profile: (username: MaybeRef<string>) => ['profile', username],
  characterDraft: (locale: MaybeRef<string>) => [locale, 'character-draft'],
  characterDraftEdit: (locale: MaybeRef<string>, characterId: MaybeRef<number | null>) => [locale, 'character-draft', characterId],
  pricingData: ['pricing-data'],
  messageSend: (username: MaybeRef<string>) => ['message-send', username],
}
