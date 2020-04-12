import { observable } from "mobx"
import { CharacterGender, CharacterStatus } from "./types"

export class CharacterState {
  constructor(
    public readonly name: string,
    gender: CharacterGender = "None",
    status: CharacterStatus = "offline",
    statusMessage: string = "",
  ) {
    this.gender = gender
    this.status = status
    this.statusMessage = statusMessage
  }

  @observable
  gender: CharacterGender

  @observable
  status: CharacterStatus

  @observable
  statusMessage: string
}
