import { observable } from "mobx"
import { ChannelModel } from "../channel/ChannelModel"
import { CharacterModel } from "../character/CharacterModel"
import { MessageModel } from "../message/MessageModel"
import { MapWithDefault } from "../state/MapWithDefault"
import { ServerCommand, ServerCommandRecord } from "./commands"
import { SocketHandler } from "./SocketHandler"

export class ChatStore {
  characters = new MapWithDefault((name) => new CharacterModel(name))

  @observable.shallow
  channels: ChannelModel[] = []

  constructor(private identity: string, private socket: SocketHandler) {}

  private updateChannel(id: string, doUpdate: (channel: ChannelModel) => void) {
    const channel = this.channels.find((it) => it.id === id)
    if (channel) {
      doUpdate(channel)
    }
  }

  handleSocketCommand(command: ServerCommand) {
    type HandlerMap = {
      [K in keyof ServerCommandRecord]?: (
        this: ChatStore,
        params: ServerCommandRecord[K],
      ) => void
    }

    const handlerMap: HandlerMap = {
      VAR() {},

      FRL() {},
      IGN() {},
      ADL() {},

      LIS({ characters }) {
        for (const [name, gender, status, statusMessage] of characters) {
          this.characters.set(
            name,
            new CharacterModel(name, gender, status, statusMessage),
          )
        }
      },

      NLN({ identity, gender, status }) {
        this.characters.set(
          identity,
          new CharacterModel(identity, gender, status),
        )
      },

      FLN({ character }) {
        this.characters.delete(character)

        for (const channel of this.channels) {
          channel.users.delete(character)
        }
      },

      STA({ character: name, status, statusmsg }) {
        this.characters.update(name, (char) => {
          char.status = status
          char.statusMessage = statusmsg
        })
      },

      IDN() {
        this.socket.send({ type: "JCH", params: { channel: "Frontpage" } })
        this.socket.send({ type: "JCH", params: { channel: "Fantasy" } })
        this.socket.send({
          type: "JCH",
          params: { channel: "Story Driven LFRP" },
        })
        this.socket.send({ type: "JCH", params: { channel: "Development" } })
      },

      JCH({ channel: id, character: { identity }, title }) {
        if (identity === this.identity) {
          const channel = new ChannelModel(id)
          this.channels.push(channel)
        }

        this.updateChannel(id, (channel) => {
          channel.title = title
          channel.users.add(identity)
        })
      },

      LCH({ channel: id, character }) {
        if (character === this.identity) {
          this.channels = this.channels.filter((it) => it.id !== id)
          return
        }

        this.updateChannel(id, (channel) => {
          channel.users.delete(character)
        })
      },

      ICH({ channel: id, users, mode }) {
        this.updateChannel(id, (channel) => {
          channel.users = new Set(users.map((it) => it.identity))
          channel.mode = mode
        })
      },

      CDS({ channel: id, description }) {
        this.updateChannel(id, (channel) => {
          channel.description = description
        })
      },

      COL({ channel: id, oplist }) {
        this.updateChannel(id, (channel) => {
          channel.ops = new Set(oplist)
        })
      },

      MSG({ channel: id, character, message }) {
        this.updateChannel(id, (channel) => {
          channel.messages.add(
            new MessageModel(character, message, "normal", Date.now()),
          )
        })
      },

      LRP({ channel: id, character, message }) {
        this.updateChannel(id, (channel) => {
          channel.messages.add(
            new MessageModel(character, message, "lfrp", Date.now()),
          )
        })
      },

      RLL(params) {
        if ("channel" in params) {
          const { channel: id, message } = params

          this.updateChannel(id, (channel) => {
            channel.messages.add(
              new MessageModel(undefined, message, "system", Date.now()),
            )
          })
        }
      },
    }

    const handler = handlerMap[command.type]
    handler?.call(this, command.params as never) // lol

    if (!handler && process.env.NODE_ENV === "development") {
      console.log(command.type, command.params)
    }
  }
}
