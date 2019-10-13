import { action, observable } from "mobx"
import OverlayState from "../ui/OverlayState"
import { Position } from "../ui/types"

export default class ChatOverlayStore {
  primaryNavigation = new OverlayState()
  channelBrowser = new OverlayState()
  channelMenu = new OverlayState()
  channelDescription = new OverlayState()

  characterMenu = new OverlayState()

  @observable
  characterMenuTarget?: string

  @observable.ref
  characterMenuPosition: Position = { x: 0, y: 0 }

  @action
  openCharacterMenu = (targetName: string, position: Position) => {
    this.characterMenuTarget = targetName
    this.characterMenuPosition = position
    this.characterMenu.show()
  }
}
