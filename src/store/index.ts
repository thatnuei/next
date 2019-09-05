import { createOvermind, IConfig } from "overmind"
import { createHook } from "overmind-react"
import { setIdentity } from "../chat/actions"
import { storedIdentity } from "../chat/effects"
import { submitLogin } from "../flist/actions"
import { flist } from "../flist/effects"
import { state } from "./state"

const config = {
  state,

  actions: {
    submitLogin,
    setIdentity,
  },

  effects: {
    flist,
    storedIdentity,
  },
}

export function createAppStore() {
  return createOvermind(config)
}

export const useStore = createHook<typeof config>()

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}
