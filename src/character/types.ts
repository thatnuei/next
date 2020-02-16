import * as fchat from "fchat"

export type Character = {
  name: string
  gender: CharacterGender
  status: CharacterStatus
  statusMessage: string
}

export type CharacterStatus = fchat.Character.Status
export type CharacterGender = fchat.Character.Gender
