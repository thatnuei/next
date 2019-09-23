import { Config, createOvermind, IConfig, Overmind } from "overmind"
import { merge, namespaced } from "overmind/config"
import * as appActions from "../app/actions"
import * as channelActions from "./channelStore/actions"
import * as characterActions from "./characterStore/actions"
import * as chatActions from "./chat/actions"
import { identityStorage, socket } from "./chat/effects"
import { flist } from "./effects"
import { onInitialize } from "./onInitialize"
import { state } from "./state"
import * as userActions from "./user/actions"

export const config = merge(
  {
    state,
    effects: {
      flist,
      socket,
      identityStorage,
    },
    onInitialize,
  },
  namespaced({
    app: { actions: appActions },
    channel: { actions: channelActions },
    character: { actions: characterActions },
    chat: { actions: chatActions },
    user: { actions: userActions },
  }),
)

export function createAppStore() {
  return createOvermind(config)
}

declare module "overmind" {
  interface Config extends IConfig<typeof config> {}
}

export type State = Overmind<Config>["state"]
