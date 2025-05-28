export function getContactName(names: {
  username: string
  contactName?: string
  characterName?: string
}) {
  const displayName = names.contactName || names.characterName || `@${names.username}`
  const avatarName = names.contactName || names.characterName || names.username

  return {
    displayName,
    avatarName,
  }
}
