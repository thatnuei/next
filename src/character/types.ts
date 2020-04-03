import * as fchat from "fchat"

export type CharacterState = {
  name: string
  gender: CharacterGender
  status: CharacterStatus
  statusMessage: string
}

export type CharacterStatus = fchat.Character.Status
export type CharacterGender = fchat.Character.Gender
