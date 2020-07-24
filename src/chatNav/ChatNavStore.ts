import { observable } from "micro-observables"
import { ChannelStore } from "../channel/ChannelStore"
import { PrivateChatStore } from "../privateChat/PrivateChatStore"
import { createBoundCommandHandler } from "../socket/commandHelpers"
import { SocketHandler } from "../socket/SocketHandler"

type ChatNavView = {
  channelId?: string
  privateChatPartner?: string
}

export class ChatNavStore {
  private readonly viewMutable = observable<ChatNavView>({})
  readonly view = this.viewMutable.readOnly()

  constructor(
    private readonly socket: SocketHandler,
    private readonly channelStore: ChannelStore,
    private readonly privateChatStore: PrivateChatStore,
  ) {
    this.socket.commandStream.listen(this.handleCommand)
  }

  showChannel = (channelId: string) => {
    this.viewMutable.set({ channelId })
    this.channelStore.getChannel(channelId).isUnread.set(false)
  }

  showPrivateChat = (privateChatPartner: string) => {
    this.viewMutable.set({ privateChatPartner })
    this.privateChatStore.getChat(privateChatPartner).isUnread.set(false)
    this.privateChatStore.open(privateChatPartner)
  }

  private handleCommand = createBoundCommandHandler(this, {
    MSG({ channel: channelId }) {
      if (this.view.get().channelId !== channelId) {
        this.channelStore.getChannel(channelId).isUnread.set(true)
      }
    },
    PRI({ character }) {
      if (this.view.get().privateChatPartner !== character) {
        this.privateChatStore.getChat(character).isUnread.set(true)
      }
    },
  })
}
