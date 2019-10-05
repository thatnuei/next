import { Config, createOvermind, IConfig, Overmind } from "overmind"
import { merge, namespaced } from "overmind/config"
import * as app from "../app/namespace"
import * as channel from "../channel/namespace"
import * as character from "../character/namespace"
import * as chat from "../chat/namespace"
import * as flist from "../flist/namespace"
import * as user from "../user/namespace"
import { onInitialize } from "./onInitialize"

export const config = merge(
  { onInitialize },
  namespaced({
    app,
    channel,
    character,
    chat,
    flist,
    user,
  }),
)

export function createAppStore() {
  return createOvermind(config)
}

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}

export type StoreState = Overmind<Config>["state"]
