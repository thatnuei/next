export type MessageModel = ReturnType<typeof createMessageModel>
export type MessageType = "normal" | "action" | "lfrp" | "warning" | "system"

const actionRegex = /^\s*\/me\s*/
const warningRegex = /^\s*\/warn\s*/

function generateMessageKey() {
  return String(Math.random())
}

export function createMessageModel(args: {
  text: string
  type: MessageType
  senderName?: string
  timestamp?: number
  key?: string
}) {
  return {
    ...args,
    key: args.key || generateMessageKey(),
    timestamp: args.timestamp || Date.now(),
  }
}

export function createChannelMessage(senderName: string, text: string) {
  const type = ((): MessageType => {
    if (actionRegex.test(text)) return "action"
    if (warningRegex.test(text)) return "warning"
    return "normal"
  })()

  return createMessageModel({
    senderName,
    text: text.replace(actionRegex, "").replace(warningRegex, ""),
    type,
  })
}

export function createPrivateMessage(senderName: string, text: string) {
  const type: MessageType = actionRegex.test(text) ? "action" : "normal"

  return createMessageModel({
    senderName,
    text: text.replace(actionRegex, ""),
    type,
  })
}

export function createAdMessage(senderName: string, text: string) {
  return createMessageModel({ senderName, text, type: "lfrp" })
}

export function createSystemMessage(text: string) {
  return createMessageModel({ text, type: "system" })
}
