import { action, observable } from "mobx"
import { CharacterStatus, Gender } from "./types"

export default class CharacterModel {
  @observable gender: Gender
  @observable status: CharacterStatus
  @observable statusMessage: string

  constructor(
    public readonly name: string,
    gender: Gender = "None",
    status: CharacterStatus = "offline",
    statusMessage = "",
  ) {
    this.gender = gender
    this.status = status
    this.statusMessage = statusMessage
  }

  @action
  setGender(gender: Gender) {
    this.gender = gender
  }

  @action
  setStatus(status: CharacterStatus, statusMessage = "") {
    this.status = status
    this.statusMessage = statusMessage
  }
}
