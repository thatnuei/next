import { mdiAccountMultiple } from "@mdi/js"
import React from "react"
import MediaQuery from "react-responsive"
import { appStore } from "../app/AppStore"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import { userListBreakpoint } from "./breakpoints"
import { userListOverlay } from "./ConversationUserList"

// TODO: move this as a part of the ChannelHeader component
export const ConversationUsersToggle = (props: { users: string[]; ops: Map<string, true> }) => (
  <MediaQuery maxWidth={userListBreakpoint}>
    <Button
      flat
      onClick={() => appStore.navigationStore.push(userListOverlay(props.users, props.ops))}
    >
      <Icon path={mdiAccountMultiple} />
    </Button>
  </MediaQuery>
)
