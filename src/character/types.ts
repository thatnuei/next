import type * as fchat from "fchat"

export type CharacterStatus = fchat.Character.Status
export type CharacterGender = fchat.Character.Gender

export type Friendship = {
  us: string
  them: string
}

export type Character = {
  readonly name: string
  readonly gender: CharacterGender
  readonly status: CharacterStatus
  readonly statusMessage: string
}
