import { mdiAccountMultiple } from "@mdi/js"
import React from "react"
import MediaQuery from "react-responsive"
import { rootStore } from "../app/RootStore"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import { userListBreakpoint } from "./breakpoints"
import { userListOverlay } from "./ConversationUserList"

export const ConversationUsersToggle = (props: { users: string[] }) => (
  <MediaQuery maxWidth={userListBreakpoint}>
    <Button flat onClick={() => rootStore.navigationStore.push(userListOverlay(props.users))}>
      <Icon path={mdiAccountMultiple} />
    </Button>
  </MediaQuery>
)
