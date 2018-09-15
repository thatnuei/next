import { mdiMenu } from "@mdi/js"
import React from "react"
import MediaQuery from "react-responsive"
import { navigationStore } from "../navigation/NavigationStore"
import { chatSidebarOverlay } from "../navigation/screens"
import { Button } from "../ui/Button"
import { Icon } from "../ui/Icon"
import { chatSidebarBreakpoint } from "./breakpoints"

export const ChatSidebarToggle = () => (
  <MediaQuery maxWidth={chatSidebarBreakpoint}>
    <Button flat onClick={() => navigationStore.push(chatSidebarOverlay())}>
      <Icon path={mdiMenu} />
    </Button>
  </MediaQuery>
)
