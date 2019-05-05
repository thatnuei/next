import OverlayViewModel from "./OverlayViewModel"

export default class OverlayStore {
  chatNav = new OverlayViewModel()
  userList = new OverlayViewModel()
  updateStatus = new OverlayViewModel()
  channelBrowser = new OverlayViewModel()
}
