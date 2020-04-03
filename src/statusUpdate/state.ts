import { observable } from "mobx"
import { CharacterStatus } from "../character/types"

export class StatusUpdateFormState {
  @observable status: CharacterStatus = "online"
  @observable statusMessage = ""

  @observable canSubmit = true
}
