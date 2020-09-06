export type MessageState = ReturnType<typeof createMessageState>
export type MessageType = "normal" | "action" | "lfrp" | "warning" | "system"

const actionRegex = /^\s*\/me\s*/
const warningRegex = /^\s*\/warn\s*/

function generateMessageKey() {
  return String(Math.random())
}

export function createMessageState(args: {
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

  return createMessageState({
    senderName,
    text: text.replace(actionRegex, "").replace(warningRegex, ""),
    type,
  })
}

export function createPrivateMessage(senderName: string, text: string) {
  const type: MessageType = actionRegex.test(text) ? "action" : "normal"

  return createMessageState({
    senderName,
    text: text.replace(actionRegex, ""),
    type,
  })
}

export function createAdMessage(senderName: string, text: string) {
  return createMessageState({ senderName, text, type: "lfrp" })
}

export function createSystemMessage(text: string) {
  return createMessageState({ text, type: "system" })
}
