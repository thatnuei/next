import * as fchat from "fchat"

export type Character = {
  name: string
  gender: CharacterGender
  status: CharacterStatus
  statusMessage: string
}

export type CharacterStatus = fchat.Character.Status
export type CharacterGender = fchat.Character.Gender

export function createCharacter(
  name: string,
  gender: CharacterGender = "None",
  status: CharacterStatus = "offline",
  statusMessage = "",
): Character {
  return { name, gender, status, statusMessage }
}
