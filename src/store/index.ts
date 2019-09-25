import { Config, createOvermind, IConfig, Overmind } from "overmind"
import * as appActions from "../app/actions"
import * as channelActions from "../channel/actions"
import * as characterActions from "../character/actions"
import * as chatActions from "../chat/actions"
import { identityStorage, socket } from "../chat/effects"
import { flist } from "../flist/effects"
import * as userActions from "../user/actions"
import { onInitialize } from "./onInitialize"
import { state } from "./state"

export const config = {
  state,
  effects: {
    flist,
    socket,
    identityStorage,
  },
  actions: {
    app: appActions,
    channel: channelActions,
    character: characterActions,
    chat: chatActions,
    user: userActions,
  },
  onInitialize,
}

export function createAppStore() {
  return createOvermind(config)
}

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}

export type StoreState = Overmind<Config>["state"]
