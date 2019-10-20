import { action, observable, runInAction } from "mobx"
import { createCommandHandler } from "../chat/helpers"
import { createUpdateStatusModal, updateStatusModalKey } from "../chat/overlays"
import sleep from "../common/helpers/sleep"
import RootStore from "../RootStore"
import FactoryMap from "../state/classes/FactoryMap"
import CharacterModel from "./CharacterModel"
import { CharacterStatus } from "./types"

export default class CharacterStore {
  characters = new FactoryMap((name) => new CharacterModel(name))

  @observable
  updatingStatus = false

  constructor(private root: RootStore) {}

  showUpdateStatusScreen = () => {
    this.root.overlayStore.open(createUpdateStatusModal())
  }

  @action
  updateStatus = async (status: CharacterStatus, statusmsg: string) => {
    this.root.socketStore.sendCommand("STA", { status, statusmsg })
    this.updatingStatus = true

    await sleep(3000)

    runInAction(() => {
      this.updatingStatus = false
    })
  }

  @action
  handleSocketCommand = createCommandHandler({
    LIS: ({ characters: characterInfoTuples }) => {
      for (const [name, gender, status, statusMessage] of characterInfoTuples) {
        const char = this.characters.get(name)
        char.setGender(gender)
        char.setStatus(status, statusMessage)
      }
    },

    NLN: ({ gender, identity }) => {
      const char = this.characters.get(identity)
      char.setGender(gender)
      char.setStatus("online")
    },

    FLN: ({ character: identity }) => {
      const char = this.characters.get(identity)
      char.setStatus("offline")
    },

    STA: ({ character: identity, status, statusmsg }) => {
      const char = this.characters.get(identity)
      char.setStatus(status, statusmsg)

      if (identity === this.root.chatStore.identity) {
        this.updatingStatus = false
        this.root.overlayStore.close(updateStatusModalKey)
      }
    },
  })
}
