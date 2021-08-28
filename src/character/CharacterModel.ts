import { ObjectStore } from "../state/store"
import type { Character, CharacterGender, CharacterStatus } from "./types"

export class CharacterModel extends ObjectStore<Character> {
  setGender(gender: CharacterGender) {
    this.merge({ gender })
  }

  setStatus(status: CharacterStatus, statusMessage: string) {
    this.merge({ status, statusMessage })
  }
}
