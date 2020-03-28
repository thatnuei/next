export class MessageModel {
  readonly key = String(Math.random())

  constructor(
    readonly senderName: string | undefined,
    readonly text: string,
    readonly type: MessageType,
    readonly timestamp: number,
  ) {}
}

export type MessageType = "normal" | "lfrp" | "admin" | "system"
