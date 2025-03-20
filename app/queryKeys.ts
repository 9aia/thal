export default {
  contacts: ['contacts'],
  contactsSearch: (search: MaybeRef<string>) => ['contacts', search],
  contactInfo: (username: MaybeRef<string | undefined>) => ['contact-info', username],
  chat: (username: MaybeRef<string>) => ['chat', username],
  chats: ['chats'],
  chatsSearch: (search: MaybeRef<string>) => ['chats', search],
  myCharacters: ['my-characters'],
  discoverCharactersSearch: (search?: MaybeRef<string | undefined>, categoryId?: MaybeRef<number | undefined>) => ['discover-characters', search, categoryId],
  discoverCharacters: ['discover-characters'],
  profile: (username: MaybeRef<string>) => ['profile', username],
  pricingData: ['pricing-data'],
  characterDraft: ['character-draft'],
}
