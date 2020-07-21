import { AppStore } from "../app/AppStore"
import { UserStore } from "../app/UserStore"
import { CharacterStore } from "../character/CharacterStore"
import { SocketHandler } from "../socket/SocketHandler"

export class RootStore {
  readonly socket = new SocketHandler()
  readonly userStore = new UserStore()
  readonly appStore = new AppStore(this.socket, this.userStore)
  readonly characterStore = new CharacterStore(
    this.socket,
    this.userStore,
    this.appStore,
  )
}
