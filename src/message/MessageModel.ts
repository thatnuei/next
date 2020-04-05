export class MessageModel {
  readonly key = String(Math.random())

  private constructor(
    readonly senderName: string | undefined,
    readonly text: string,
    readonly type: MessageType,
    readonly timestamp: number,
  ) {}

  static fromChannelMessage(senderName: string, text: string) {
    const type = ((): MessageType => {
      if (actionRegex.test(text)) return "action"
      if (warningRegex.test(text)) return "warning"
      return "normal"
    })()

    return new MessageModel(
      senderName,
      text.replace(actionRegex, "").replace(warningRegex, ""),
      type,
      Date.now(),
    )
  }

  static fromPrivateMessage(senderName: string, text: string) {
    const type = ((): MessageType => {
      if (actionRegex.test(text)) return "action"
      return "normal"
    })()

    return new MessageModel(
      senderName,
      text.replace(actionRegex, ""),
      type,
      Date.now(),
    )
  }

  static fromAd(senderName: string, text: string) {
    return new MessageModel(senderName, text, "lfrp", Date.now())
  }

  static fromSystem(text: string) {
    return new MessageModel(undefined, text, "system", Date.now())
  }
}

export type MessageType = "normal" | "action" | "lfrp" | "warning" | "system"

const actionRegex = /^\s*\/me\s*/
const warningRegex = /^\s*\/warn\s*/
