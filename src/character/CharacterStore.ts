import { memoize } from "../helpers/common/memoize"
import { createBoundCommandHandler } from "../socket/commandHelpers"
import { SocketHandler } from "../socket/SocketHandler"
import { CharacterModel } from "./CharacterModel"

// type Friendship = {
//   us: string
//   them: string
// }

export class CharacterStore {
  // i dunno if these are gonna stay here
  // friends = observable<Friendship[]>([])
  // bookmarks = observable<string[]>([])
  // ignored = observable<string[]>([])
  // admins = observable<string[]>([])

  constructor(socket: SocketHandler) {
    socket.commandStream.listen(this.handleCommand)
  }

  private getCharacterById = memoize((id: string, name: string) => {
    return new CharacterModel(id, name)
  })

  getCharacter = (name: string) =>
    this.getCharacterById(name.toLowerCase(), name)

  handleCommand = createBoundCommandHandler(this, {
    LIS({ characters }) {
      for (const [name, gender, status, statusMessage] of characters) {
        const char = this.getCharacter(name)
        char.name.set(name)
        char.gender.set(gender)
        char.status.set({ type: status, text: statusMessage })
      }
    },

    NLN({ identity: name, gender, status }) {
      const char = this.getCharacter(name)
      char.name.set(name)
      char.gender.set(gender)
      char.status.set({ type: status, text: "" })
    },

    FLN({ character: name }) {
      const char = this.getCharacter(name)
      char.status.set({ type: "offline", text: "" })
    },

    STA({ character: name, status, statusmsg }) {
      const char = this.getCharacter(name)
      char.status.set({ type: status, text: statusmsg })
    },
  })
}
