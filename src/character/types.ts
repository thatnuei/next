import * as fchat from "fchat"

export type Gender = fchat.Character.Gender
export type CharacterStatus = fchat.Character.Status

export type Character = {
  name: string
  gender: Gender
  status: CharacterStatus
  statusMessage: string
}
