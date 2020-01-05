import { observable } from "mobx"
import { Character, CharacterStatus, Gender } from "./types"

export function createCharacter(
  name: string,
  gender: Gender = "None",
  status: CharacterStatus = "offline",
  statusMessage = "",
): Character {
  return observable({
    name,
    gender,
    status,
    statusMessage,
  })
}
