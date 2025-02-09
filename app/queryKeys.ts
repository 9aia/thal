export default {
  contacts: ['contacts'],
  contactsSearch: (search: MaybeRef<string>) => ['contacts', search],
  contactInfo: (username: MaybeRef<string | undefined>) => ['contact-info', username],
  chat: (username: MaybeRef<string>) => ['chat', username],
  chats: ['chats'],
  chatsSearch: (search: MaybeRef<string>) => ['chats', search],
  myPersonas: ['my-personas'],
  discoverPersonasSearch: (search?: MaybeRef<string | undefined>, categoryId?: MaybeRef<number | undefined>) => ['discover-personas', search, categoryId],
  discoverPersonas: ['discover-personas'],
  profile: (username: MaybeRef<string>) => ['profile', username],
  price: ['price'],
}
