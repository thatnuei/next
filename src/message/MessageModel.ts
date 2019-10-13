import createUniqueId from "../common/helpers/createUniqueId"
import { MessageType } from "./types"

export default class MessageModel {
  readonly id = createUniqueId()
  readonly time = Date.now()

  constructor(
    public readonly senderName: string | undefined, // if there is no sender, it is a system message
    public readonly text: string,
    public readonly type: MessageType,
  ) {}
}
