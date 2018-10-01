import { action, observable } from "mobx"
import { CharacterGender, CharacterStatus } from "../character/types"
import { ServerCommand } from "../socket/SocketHandler"

export class ChatViewModel {
  @observable.shallow
  characters = new Map<string, CharacterData>()

  @observable.shallow
  friends = new Map<string, true>()

  @observable.shallow
  ignored = new Map<string, true>()

  @observable.shallow
  admins = new Map<string, true>()

  getCharacter(name: string): CharacterData {
    return (
      this.characters.get(name) || { name, gender: "None", status: "offline", statusMessage: "" }
    )
  }

  @action
  handleSocketCommand = (command: ServerCommand) => {
    switch (command.type) {
      case "IDN": {
        console.info("Successfully connected to server.")
        break
      }

      case "HLO": {
        console.info(command.params.message)
        break
      }

      case "CON": {
        console.info(`There are ${command.params.count} characters in chat`)
        break
      }

      case "VAR": {
        break
      }

      case "FRL": {
        for (const name of command.params.characters) {
          this.friends.set(name, true)
        }
        break
      }

      case "IGN": {
        const { params } = command

        if (params.action === "init" || params.action === "list") {
          for (const name of params.characters) {
            this.ignored.set(name, true)
          }
        } else if (params.action === "add") {
          this.ignored.set(params.character, true)
        } else if (params.action === "delete") {
          this.ignored.delete(params.character)
        }
        break
      }

      case "ADL": {
        for (const name of command.params.ops) {
          this.admins.set(name, true)
        }
        break
      }

      case "LIS": {
        for (const [name, gender, status, statusMessage] of command.params.characters) {
          this.characters.set(name, { name, gender, status, statusMessage })
        }
        break
      }

      case "NLN": {
        const { identity, gender } = command.params

        this.characters.set(identity, {
          name: identity,
          gender,
          status: "online",
          statusMessage: "",
        })
        break
      }

      case "FLN": {
        this.characters.delete(command.params.character)
        break
      }

      case "STA": {
        const { character: name, status, statusmsg } = command.params
        const { gender = "None" }: Partial<CharacterData> = this.characters.get(name) || {}
        this.characters.set(name, { name, gender, status, statusMessage: statusmsg })
        break
      }

      default: {
        console.log("unhandled command", command.type, command.params)
      }
    }
  }
}

export type CharacterData = {
  name: string
  gender: CharacterGender
  status: CharacterStatus
  statusMessage: string
}
