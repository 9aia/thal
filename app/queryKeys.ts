export default {
  contacts: ["contacts"],
  contactInfo: (username: MaybeRef<string>) => ["contact-info", username],
  chat: (username: MaybeRef<string>) => ["chat", username],
  chats: ["chats"],
  lastMessages: ["last-messages"],
  myPersonas: ["my-personas"],
  discoverPersonas: (search?: MaybeRef<string | undefined>, categoryId?: MaybeRef<number | undefined>) => ["discover-personas", search, categoryId],
  profile: (username: MaybeRef<string>) => ["profile", username],
}
