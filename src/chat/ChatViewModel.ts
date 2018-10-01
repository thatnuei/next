import { action, observable } from "mobx"
import { CharacterModel } from "../character/CharacterModel"
import { ServerCommand } from "../socket/SocketHandler"

export class ChatViewModel {
  @observable.shallow
  characters = new Map<string, CharacterModel>()

  @observable.shallow
  friends = new Map<string, true>()

  @observable.shallow
  ignored = new Map<string, true>()

  @observable.shallow
  admins = new Map<string, true>()

  getCharacter(name: string): CharacterModel {
    return this.characters.get(name) || new CharacterModel(name, "None", "offline")
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
        for (const identity of command.params.characters) {
          this.friends.set(identity, true)
        }
        break
      }

      case "IGN": {
        const { params } = command
        if (params.action === "init" || params.action === "list") {
          for (const identity of params.characters) {
            this.ignored.set(identity, true)
          }
        }
        if (params.action === "add") {
          this.ignored.set(params.character, true)
        }
        if (params.action === "delete") {
          this.ignored.delete(params.character)
        }
        break
      }

      case "ADL": {
        for (const identity of command.params.ops) {
          this.admins.set(identity, true)
        }
        break
      }

      case "LIS": {
        for (const info of command.params.characters) {
          this.characters.set(info[0], new CharacterModel(...info))
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
        const { character: identity, status, statusmsg } = command.params
        const { gender } = this.getCharacter(identity)
        this.characters.set(identity, new CharacterModel(identity, gender, status, statusmsg))
        break
      }

      default: {
        console.log("unhandled command", command.type, command.params)
      }
    }
  }
}
