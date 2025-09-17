export function getFullMessage(message?: string, replyMessage?: string, trim = 300, lineclamp = 3) {
  let fullMessage = ``

  if (replyMessage) {
    const replyMessageLines = replyMessage.slice(0, trim - 3).split('\n')
    const replyMessageTrimmed = replyMessageLines.slice(0, lineclamp)

    let replyMessageWithArrow = replyMessageTrimmed.map(line => `> ${line}`).join('\n')
    replyMessageWithArrow += '...'

    fullMessage += `${replyMessageWithArrow}\n\n`
  }

  if (message)
    fullMessage += message

  return fullMessage
}

export function trimReplyMessage(replyMessage: string, trim = 300, lineclamp = 3) {
  if (replyMessage.length > trim) {
    const replyMessageLines = replyMessage.slice(0, trim - 3).split('\n')
    let replyMessageTrimmed = replyMessageLines.slice(0, lineclamp).join('\n')
    replyMessageTrimmed += '...'
    return replyMessageTrimmed
  }

  const replyMessageTrimmed = replyMessage.split('\n')

  if (replyMessageTrimmed.length > lineclamp)
    return `${replyMessageTrimmed.slice(0, lineclamp).join('\n')}...`

  return replyMessageTrimmed.join('\n')
}
