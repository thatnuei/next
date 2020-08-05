import { curry, without } from "lodash-es"
import { observable, Observable } from "micro-observables"
import { concatUniq } from "../helpers/common/concatUniq"
import { factoryFrom } from "../helpers/common/factoryFrom"
import { memoize } from "../helpers/common/memoize"
import { createPrivateMessage } from "../message/MessageState"
import { createBoundCommandHandler } from "../socket/helpers"
import { SocketHandler } from "../socket/SocketHandler"
import { PrivateChatModel } from "./PrivateChatModel"
import { restorePrivateChats, savePrivateChats } from "./storage"

const withoutCurried = curry(without)

export class PrivateChatStore {
  constructor(
    private readonly socket: SocketHandler,
    private readonly identity: Observable<string>,
  ) {
    socket.commands.subscribe(this.handleCommand)

    this.openChatNames.onChange((names) => {
      savePrivateChats(identity.get(), names)
    })
  }

  private readonly openChatNames = observable<string[]>([])

  getChat = memoize(factoryFrom(PrivateChatModel))

  openChats = () =>
    this.openChatNames.transform((names) => names.map(this.getChat))

  isOpen = (partnerName: string) =>
    this.openChatNames.transform((names) => names.includes(partnerName))

  open = (partnerName: string) => {
    this.openChatNames.update(concatUniq(partnerName))
  }

  close = (partnerName: string) => {
    this.openChatNames.update(withoutCurried([partnerName]))
  }

  sendMessage = (partnerName: string, text: string) => {
    this.socket.send({
      type: "PRI",
      params: { recipient: partnerName, message: text },
    })

    this.getChat(partnerName).addMessage(
      createPrivateMessage(this.identity.get(), text),
    )
  }

  handleCommand = createBoundCommandHandler(this, {
    async IDN() {
      const names = await restorePrivateChats(this.identity.get()).catch(
        (error) => {
          console.warn("Could not restore private chats", error)
          return []
        },
      )
      this.openChatNames.set(names)
    },
    PRI({ character, message }) {
      this.open(character)

      this.getChat(character).addMessage(
        createPrivateMessage(character, message),
      )
    },
    TPN({ character, status }) {
      this.getChat(character).typingStatus.set(status)
    },
  })
}
