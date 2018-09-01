import * as fchat from "fchat"
import { observable } from "mobx"

export class CharacterModel {
  @observable
  gender: fchat.Character.Gender

  @observable
  status: fchat.Character.Status

  @observable
  statusMessage: string

  constructor(
    public readonly name: string,
    gender: fchat.Character.Gender,
    status: fchat.Character.Status,
    statusMessage = "",
  ) {
    this.gender = gender
    this.status = status
    this.statusMessage = statusMessage
  }
}
