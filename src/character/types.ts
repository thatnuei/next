import type * as fchat from "fchat"

export type CharacterStatus = fchat.Character.Status
export type CharacterGender = fchat.Character.Gender

export type Friendship = {
  us: string
  them: string
}

export type Character = {
  name: string
  gender: CharacterGender
  status: CharacterStatus
  statusMessage: string
}
