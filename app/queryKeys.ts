export default {
  contacts: ["contacts"],
  contactsSearch: (search: MaybeRef<string>) => ["contacts", search],
  contactInfo: (username: MaybeRef<string | undefined>) => ["contact-info", username],
  chat: (username: MaybeRef<string>) => ["chat", username],
  chats: ["chats"],
  chatsSearch: (search: MaybeRef<string>) => ["chats", search],
  lastMessages: ["last-messages"],
  myPersonas: ["my-personas"],
  discoverPersonas: (search?: MaybeRef<string | undefined>, categoryId?: MaybeRef<number | undefined>) => ["discover-personas", search, categoryId],
  profile: (username: MaybeRef<string>) => ["profile", username],
}
