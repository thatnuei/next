import { createOvermind, IConfig } from "overmind"
import { createHook } from "overmind-react"
import { showLogin } from "../app/actions"
import { setIdentity } from "../chat/actions"
import { identityStorage } from "../chat/effects"
import { socket } from "../fchat/effects"
import { submitLogin } from "../flist/actions"
import { flist } from "../flist/effects"
import { state } from "./state"

const config = {
  state,

  actions: {
    submitLogin,
    setIdentity,
    showLogin,
  },

  effects: {
    flist,
    identityStorage,
    socket,
  },
}

export function createAppStore() {
  return createOvermind(config)
}

export const useStore = createHook<typeof config>()

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
