import { AppStore } from "../app/AppStore"
import { SocketHandler } from "../socket/SocketHandler"

export class RootStore {
  readonly socket = new SocketHandler()
  readonly appStore = new AppStore(this.socket)
}
