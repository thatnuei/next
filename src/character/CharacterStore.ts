import { DictStore } from "../state/store"
import type { Character, CharacterGender, CharacterStatus } from "./types"

export class CharacterStore extends DictStore<Character> {
  constructor() {
    super((name) => ({
      name,
      gender: "None",
      status: "offline",
      statusMessage: "",
    }))
  }

  setGender(name: string, gender: CharacterGender) {
    this.updateItem(name, (char) => ({ ...char, gender }))
  }

  setStatus(name: string, status: CharacterStatus, statusMessage: string) {
    this.updateItem(name, (char) => ({ ...char, status, statusMessage }))
  }
}
