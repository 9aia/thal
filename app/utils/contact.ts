export function getContactName(names: {
  username: string
  contactName?: string | null
  characterName?: string
}) {
  const displayName = names.contactName || names.characterName || `@${names.username}`
  const avatarName = names.contactName || names.characterName || names.username

  return {
    displayName,
    avatarName,
  }
}
