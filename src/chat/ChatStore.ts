import { CharacterCollection } from "../character/CharacterCollection"
import { CharacterStore } from "../character/CharacterStore"
import { createCommandHandler } from "./commands"
import { SocketHandler } from "./SocketHandler"

export class ChatStore {
  constructor(
    private readonly socket: SocketHandler,
    private readonly characterStore: CharacterStore,
  ) {}

  friends = new CharacterCollection(this.characterStore)
  ignored = new CharacterCollection(this.characterStore)
  admins = new CharacterCollection(this.characterStore)

  handleCommand = createCommandHandler(this, {
    IDN() {
      this.socket.send({ type: "JCH", params: { channel: "Frontpage" } })
      this.socket.send({ type: "JCH", params: { channel: "Fantasy" } })
      this.socket.send({
        type: "JCH",
        params: { channel: "Story Driven LFRP" },
      })
      this.socket.send({ type: "JCH", params: { channel: "Development" } })
    },

    FRL({ characters }) {
      this.friends.setAll(characters)
    },

    IGN(params) {
      if (params.action === "init" || params.action === "list") {
        this.ignored.setAll(params.characters)
      }
      if (params.action === "add") {
        this.ignored.add(params.character)
      }
      if (params.action === "delete") {
        this.ignored.delete(params.character)
      }
    },

    ADL({ ops }) {
      this.admins.setAll(ops)
    },
  })
}
