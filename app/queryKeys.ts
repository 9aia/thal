export default {
  contacts: ["contacts"],
  chat: (username: MaybeRef<string>) => ["chat", username],
  chats: ["chats"],
  myPersonas: ["my-personas"],
  discoverPersonas: ["discover-personas"],
  profile: (username: MaybeRef<string>) => ["profile", username],
  messages: (username: MaybeRef<string>) => ["messages", username],
}
