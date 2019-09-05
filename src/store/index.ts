import { createOvermind, IConfig } from "overmind"
import { createHook } from "overmind-react"
import { showLogin } from "../app/actions"
import { setIdentity } from "../chat/actions"
import { identityStorage } from "../chat/effects"
import * as fchatActions from "../fchat/actions"
import { socket } from "../fchat/effects"
import { submitLogin } from "../flist/actions"
import { flist } from "../flist/effects"
import { onInitialize } from "./onInitialize"
import { state } from "./state"

const config = {
  state,

  actions: {
    submitLogin,
    setIdentity,
    showLogin,
    ...fchatActions,
  },

  effects: {
    flist,
    identityStorage,
    socket: socket(),
  },

  onInitialize,
}

export function createAppStore() {
  return createOvermind(config)
}

export const useStore = createHook<typeof config>()

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
