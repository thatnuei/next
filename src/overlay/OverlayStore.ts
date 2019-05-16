import RootStore from "../RootStore"
import OverlayViewModel from "./OverlayViewModel"

export default class OverlayStore {
  chatNav = new OverlayViewModel()
  userList = new OverlayViewModel()
  updateStatus = new OverlayViewModel()
  channelBrowser = new OverlayViewModel()
  onlineUsers = new OverlayViewModel()

  constructor(private root: RootStore) {}

  showChannelBrowser() {
    this.root.channelStore.requestListings()
    this.channelBrowser.open()
  }
}
