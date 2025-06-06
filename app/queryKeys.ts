export default {
  contacts: ['contacts'],
  contact: (username: MaybeRef<string>) => ['contact', username],
  contactsSearch: (search: MaybeRef<string>) => ['contacts', search],
  chat: (username: MaybeRef<string>) => ['chat', username],
  chatHistory: (username: MaybeRef<string>) => ['chat-history', username],
  chats: ['chats'],
  chatsSearch: (locale: MaybeRef<string>, search: MaybeRef<string>) => [locale, 'chats', search],
  myCharacters: ['my-characters'],
  discoverCharactersSearch: (locale: MaybeRef<string>, search?: MaybeRef<string | undefined>, categoryId?: MaybeRef<number | undefined>) => [locale, 'discover-characters', search, categoryId],
  discoverCharacters: ['discover-characters'],
  character: (locale: MaybeRef<string>, username: MaybeRef<string>) => [locale, 'character', username],
  profile: (username: MaybeRef<string>) => ['profile', username],
  pricingData: ['pricing-data'],
  characterDraft: (locale: MaybeRef<string>) => [locale, 'character-draft'],
  characterDraftEdit: (locale: MaybeRef<string>, characterId: MaybeRef<number | null>) => [locale, 'character-draft', characterId],
  contentCount: (locale: MaybeRef<string>, name?: MaybeRef<string | undefined>) => [locale, 'content-count', name],
}
