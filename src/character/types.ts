import * as fchat from "fchat"

export type Character = {
  name: string
  gender: Gender
  status: CharacterStatus
  statusMessage: string
}

export type Gender = fchat.Character.Gender
export type CharacterStatus = fchat.Character.Status
