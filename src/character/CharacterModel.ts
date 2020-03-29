import { observable } from "mobx"
import { CharacterGender, CharacterStatus } from "./types"

export class CharacterModel {
  readonly name: string

  @observable
  gender: CharacterGender

  @observable
  status: CharacterStatus

  @observable
  statusMessage: string

  constructor(
    name: string,
    gender: CharacterGender = "None",
    status: CharacterStatus = "offline",
    statusMessage: string = "",
  ) {
    this.name = name
    this.gender = gender
    this.status = status
    this.statusMessage = statusMessage
  }
}
