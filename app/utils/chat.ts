export function addReplyToMessage(message: string, replyMessage?: string, trim = 300, lineclamp = 3) {
  let fullMessage = ``

  if (replyMessage) {
    const replyMessageLines = replyMessage.slice(0, trim - 3).split("\n")
    const replyMessageTrimmed = replyMessageLines.slice(0, lineclamp)

    let replyMessageWithArrow = replyMessageTrimmed.map(line => `> ${line}`).join("\n")
    replyMessageWithArrow += "..."

    fullMessage += `${replyMessageWithArrow}\n\n`
  }

  fullMessage += message

  return fullMessage
}
