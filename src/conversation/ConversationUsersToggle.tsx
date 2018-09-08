import { mdiAccountMultiple } from "@mdi/js"
import React from "react"
import MediaQuery from "react-responsive"
import { chatViewStore } from "../chat/ChatViewStore"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import { userListBreakpoint } from "./breakpoints"

export const ConversationUsersToggle = () => (
  <MediaQuery maxWidth={userListBreakpoint}>
    <Button flat onClick={chatViewStore.userListDisplay.enable}>
      <Icon path={mdiAccountMultiple} />
    </Button>
  </MediaQuery>
)
