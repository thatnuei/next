import { action, observable, runInAction } from "mobx"
import ChatIdentity from "../chat/ChatIdentity"
import { createCommandHandler } from "../chat/helpers"
import sleep from "../common/helpers/sleep"
import RootStore from "../RootStore"
import FactoryMap from "../state/classes/FactoryMap"
import { Position } from "../ui/types"
import CharacterModel from "./CharacterModel"
import { CharacterStatus } from "./types"

export default class CharacterStore {
  characters = new FactoryMap((name) => new CharacterModel(name))

  @observable
  updatingStatus = false

  constructor(private root: RootStore, private identity: ChatIdentity) {}

  get identityCharacter() {
    return this.characters.get(this.identity.current)
  }

  showUpdateStatusScreen = () => {
    this.root.overlayStore.open({
      type: "updateStatus",
    })
  }

  showCharacterMenu = (name: string, position: Position) => {
    this.root.overlayStore.open({
      type: "characterMenu",
      params: { name, position },
    })
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

      if (identity === this.identity.current) {
        this.updatingStatus = false
        this.root.overlayStore.close("updateStatus")
      }
    },
  })
}
