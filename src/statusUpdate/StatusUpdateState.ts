import { observable } from "mobx"
import { CharacterStatus } from "../character/types"
import { OverlayState } from "../ui/OverlayState"

export class StatusUpdateState {
  @observable status: CharacterStatus = "online"
  @observable statusMessage = ""
  @observable canSubmit = true

  timeout = 5000
  overlay = new OverlayState()
}
